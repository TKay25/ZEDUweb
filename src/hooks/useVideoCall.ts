import { useState, useCallback, useRef, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import type { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng';
import { useSocket } from './useSocket';
import { useToast } from './useToast';

interface VideoCallOptions {
  appId: string;
  channel: string;
  token?: string;
  uid?: string | number;
  role?: 'host' | 'audience';
}

interface RemoteUser {
  uid: string | number;
  hasVideo: boolean;
  hasAudio: boolean;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
}

export function useVideoCall(options: VideoCallOptions) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState<any>(null);
  
  const { socket } = useSocket();
  const toast = useToast();
  const localVideoRef = useRef<HTMLDivElement>(null);
  const screenShareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initClient = () => {
      const agoraClient = AgoraRTC.createClient({ 
        mode: 'live', 
        codec: 'vp8' 
      });
      setClient(agoraClient);
    };

    initClient();

    return () => {
      leaveCall();
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localVideoTrack) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  useEffect(() => {
    if (screenShareRef.current && screenTrack) {
      screenTrack.play(screenShareRef.current);
    }
  }, [screenTrack]);

  const joinCall = useCallback(async () => {
    if (!client) return;

    try {
      // Ensure token is provided, use empty string as fallback
      const token = options.token || '';
      const uid = options.uid || Math.floor(Math.random() * 10000);
      
      await client.join(options.appId, options.channel, token, uid);
      
      // Create local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      // Publish local tracks
      await client.publish([audioTrack, videoTrack]);
      
      setIsJoined(true);

      // Handle remote users
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          setRemoteUsers(prev => {
            const existing = prev.find(u => u.uid === user.uid);
            if (existing) {
              return prev.map(u => 
                u.uid === user.uid 
                  ? { ...u, hasVideo: true, videoTrack: user.videoTrack }
                  : u
              );
            } else {
              return [...prev, { 
                uid: user.uid, 
                hasVideo: true, 
                hasAudio: false,
                videoTrack: user.videoTrack 
              }];
            }
          });
        }

        if (mediaType === 'audio') {
          setRemoteUsers(prev => {
            const existing = prev.find(u => u.uid === user.uid);
            if (existing) {
              return prev.map(u => 
                u.uid === user.uid 
                  ? { ...u, hasAudio: true, audioTrack: user.audioTrack }
                  : u
              );
            } else {
              return [...prev, { 
                uid: user.uid, 
                hasVideo: false, 
                hasAudio: true,
                audioTrack: user.audioTrack 
              }];
            }
          });
        }

        user.audioTrack?.play();
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          setRemoteUsers(prev => 
            prev.map(u => 
              u.uid === user.uid 
                ? { ...u, hasVideo: false, videoTrack: undefined }
                : u
            ).filter(u => u.hasVideo || u.hasAudio)
          );
        }

        if (mediaType === 'audio') {
          setRemoteUsers(prev => 
            prev.map(u => 
              u.uid === user.uid 
                ? { ...u, hasAudio: false, audioTrack: undefined }
                : u
            ).filter(u => u.hasVideo || u.hasAudio)
          );
        }
      });

      client.on('user-left', (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

      // Notify via socket
      socket?.emit('video:join', {
        channel: options.channel,
        uid
      });

      toast.success('Joined video call');
    } catch (error) {
      console.error('Failed to join call:', error);
      toast.error('Failed to join video call');
    }
  }, [client, options, socket, toast]);

  const leaveCall = useCallback(async () => {
    if (!client) return;

    try {
      // Close local tracks
      localAudioTrack?.close();
      localVideoTrack?.close();
      screenTrack?.close();

      // Leave channel
      await client.leave();

      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setScreenTrack(null);
      setRemoteUsers([]);
      setIsJoined(false);
      setIsScreenSharing(false);

      // Notify via socket
      socket?.emit('video:leave', {
        channel: options.channel,
        uid: options.uid
      });

      toast.success('Left video call');
    } catch (error) {
      console.error('Failed to leave call:', error);
      toast.error('Failed to leave video call');
    }
  }, [client, localAudioTrack, localVideoTrack, screenTrack, socket, options, toast]);

  const toggleMute = useCallback(() => {
    if (!localAudioTrack) return;

    localAudioTrack.setEnabled(isMuted);
    setIsMuted(!isMuted);
    
    socket?.emit('video:mute', {
      channel: options.channel,
      uid: options.uid,
      muted: !isMuted
    });
  }, [localAudioTrack, isMuted, socket, options]);

  const toggleVideo = useCallback(() => {
    if (!localVideoTrack) return;

    localVideoTrack.setEnabled(!isVideoEnabled);
    setIsVideoEnabled(!isVideoEnabled);
    
    socket?.emit('video:toggle', {
      channel: options.channel,
      uid: options.uid,
      enabled: !isVideoEnabled
    });
  }, [localVideoTrack, isVideoEnabled, socket, options]);

  const startScreenShare = useCallback(async () => {
    try {
      const screenVideoTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1'
      });
      
      setScreenTrack(screenVideoTrack);
      
      if (client) {
        await client.unpublish(localVideoTrack!);
        await client.publish(screenVideoTrack);
      }
      
      setIsScreenSharing(true);
      
      socket?.emit('video:screenShare', {
        channel: options.channel,
        uid: options.uid,
        sharing: true
      });

      toast.success('Screen sharing started');
    } catch (error) {
      console.error('Failed to start screen share:', error);
      toast.error('Failed to start screen sharing');
    }
  }, [client, localVideoTrack, socket, options, toast]);

  const stopScreenShare = useCallback(async () => {
    if (!screenTrack) return;

    try {
      if (client) {
        await client.unpublish(screenTrack);
        await client.publish(localVideoTrack!);
      }
      
      screenTrack.close();
      setScreenTrack(null);
      setIsScreenSharing(false);
      
      socket?.emit('video:screenShare', {
        channel: options.channel,
        uid: options.uid,
        sharing: false
      });

      toast.success('Screen sharing stopped');
    } catch (error) {
      console.error('Failed to stop screen share:', error);
      toast.error('Failed to stop screen sharing');
    }
  }, [client, screenTrack, localVideoTrack, socket, options, toast]);

  const switchCamera = useCallback(async () => {
    if (!localVideoTrack) return;

    const devices = await AgoraRTC.getCameras();
    const currentDeviceId = localVideoTrack.getTrackId();
    const currentIndex = devices.findIndex(d => d.deviceId === currentDeviceId);
    const nextDevice = devices[(currentIndex + 1) % devices.length];
    
    if (nextDevice) {
      await localVideoTrack.setDevice(nextDevice.deviceId);
    }
  }, [localVideoTrack]);

  const switchMicrophone = useCallback(async () => {
    if (!localAudioTrack) return;

    const devices = await AgoraRTC.getMicrophones();
    const currentDeviceId = localAudioTrack.getTrackId();
    const currentIndex = devices.findIndex(d => d.deviceId === currentDeviceId);
    const nextDevice = devices[(currentIndex + 1) % devices.length];
    
    if (nextDevice) {
      await localAudioTrack.setDevice(nextDevice.deviceId);
    }
  }, [localAudioTrack]);

  return {
    isJoined,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    remoteUsers,
    localVideoRef,
    screenShareRef,
    joinCall,
    leaveCall,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    switchCamera,
    switchMicrophone
  };
}

// Hook for recording video calls
export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const startRecording = useCallback((stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        chunksRef.current = [];
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const downloadRecording = useCallback(() => {
    if (recordingUrl) {
      const a = document.createElement('a');
      a.href = recordingUrl;
      a.download = `recording-${new Date().toISOString()}.webm`;
      a.click();
    }
  }, [recordingUrl]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isRecording,
    recordingUrl,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    startRecording,
    stopRecording,
    downloadRecording
  };
}
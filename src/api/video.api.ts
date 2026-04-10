// TODO: Uncomment when backend API calls are needed for video features
// import api from './axios.config';

// Fix Agora imports - use correct types
import AgoraRTC from 'agora-rtc-sdk-ng';
import type { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';

// Note: IRemoteUser doesn't exist in agora-rtc-sdk-ng
// Use any or create a custom interface for remote users
interface RemoteUser {
  uid: string | number;
  videoTrack?: ICameraVideoTrack;
  audioTrack?: IMicrophoneAudioTrack;
  hasVideo: boolean;
  hasAudio: boolean;
}

interface AgoraConfig {
  appId: string;
  channelName: string;
  token: string;
  uid: string | number;
}

class VideoAPI {
  private static instance: VideoAPI;
  private client: IAgoraRTCClient | null = null;
  private localTracks: {
    video?: ICameraVideoTrack;
    audio?: IMicrophoneAudioTrack;
  } = {};
  private remoteUsers: Map<string | number, RemoteUser> = new Map();
  private isInitialized: boolean = false;

  private constructor() {
    // Check if AgoraRTC is available
    if (typeof AgoraRTC !== 'undefined') {
      this.client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    } else {
      console.warn('AgoraRTC not available');
    }
  }
  
  static getInstance(): VideoAPI {
    if (!VideoAPI.instance) {
      VideoAPI.instance = new VideoAPI();
    }
    return VideoAPI.instance;
  }

  async initializeAgora(config: AgoraConfig): Promise<void> {
    if (!this.client) {
      throw new Error('Agora client not initialized');
    }

    if (this.isInitialized) {
      console.warn('Agora already initialized');
      return;
    }

    try {
      // Join the channel
      await this.client.join(config.appId, config.channelName, config.token, config.uid);
      this.isInitialized = true;

      // Create local tracks
      this.localTracks.audio = await AgoraRTC.createMicrophoneAudioTrack();
      this.localTracks.video = await AgoraRTC.createCameraVideoTrack();

      // Publish local tracks
      await this.client.publish(Object.values(this.localTracks));

      // Handle remote users
      this.client.on('user-published', async (user: any, mediaType: 'audio' | 'video') => {
        // Subscribe to the user
        await this.client!.subscribe(user, mediaType);
        
        const remoteUser: RemoteUser = {
          uid: user.uid,
          hasVideo: mediaType === 'video',
          hasAudio: mediaType === 'audio'
        };
        
        if (mediaType === 'video') {
          remoteUser.videoTrack = user.videoTrack;
          this.remoteUsers.set(user.uid, remoteUser);
          
          // Play video track
          const playerContainer = document.createElement('div');
          playerContainer.id = `remote-video-${user.uid}`;
          playerContainer.className = 'remote-video-container';
          document.getElementById('remote-video-container')?.appendChild(playerContainer);
          user.videoTrack?.play(playerContainer);
        }
        
        if (mediaType === 'audio') {
          remoteUser.audioTrack = user.audioTrack;
          this.remoteUsers.set(user.uid, remoteUser);
          user.audioTrack?.play();
        }
      });

      this.client.on('user-unpublished', (user: any, mediaType: 'audio' | 'video') => {
        const remoteUser = this.remoteUsers.get(user.uid);
        if (remoteUser) {
          if (mediaType === 'video') {
            remoteUser.hasVideo = false;
            delete remoteUser.videoTrack;
          }
          if (mediaType === 'audio') {
            remoteUser.hasAudio = false;
            delete remoteUser.audioTrack;
          }
          
          if (!remoteUser.hasVideo && !remoteUser.hasAudio) {
            this.remoteUsers.delete(user.uid);
          } else {
            this.remoteUsers.set(user.uid, remoteUser);
          }
        }
        
        // Remove video container
        document.getElementById(`remote-video-${user.uid}`)?.remove();
      });

      this.client.on('user-left', (user: any) => {
        this.remoteUsers.delete(user.uid);
        document.getElementById(`remote-video-${user.uid}`)?.remove();
      });

    } catch (error) {
      console.error('Failed to initialize Agora:', error);
      throw error;
    }
  }

  // Leave channel
  async leaveChannel(): Promise<void> {
    if (!this.client) return;

    try {
      // Close local tracks
      if (this.localTracks.audio) {
        this.localTracks.audio.close();
      }
      if (this.localTracks.video) {
        this.localTracks.video.close();
      }
      this.localTracks = {};

      // Leave the channel
      await this.client.leave();
      this.isInitialized = false;
      this.remoteUsers.clear();
    } catch (error) {
      console.error('Error leaving channel:', error);
      throw error;
    }
  }

  // Toggle audio
  async toggleAudio(): Promise<boolean> {
    if (!this.localTracks.audio) {
      throw new Error('Audio track not initialized');
    }

    const enabled = this.localTracks.audio.enabled;
    await this.localTracks.audio.setEnabled(!enabled);
    return !enabled;
  }

  // Toggle video
  async toggleVideo(): Promise<boolean> {
    if (!this.localTracks.video) {
      throw new Error('Video track not initialized');
    }

    const enabled = this.localTracks.video.enabled;
    await this.localTracks.video.setEnabled(!enabled);
    return !enabled;
  }

  // Mute remote participant
  async muteParticipant(uid: string | number): Promise<void> {
    const remoteUser = this.remoteUsers.get(uid);
    if (remoteUser && remoteUser.audioTrack) {
      await remoteUser.audioTrack.setEnabled(false);
    }
  }

  // Unmute remote participant
  async unmuteParticipant(uid: string | number): Promise<void> {
    const remoteUser = this.remoteUsers.get(uid);
    if (remoteUser && remoteUser.audioTrack) {
      await remoteUser.audioTrack.setEnabled(true);
    }
  }

  // Get remote users
  getRemoteUsers(): RemoteUser[] {
    return Array.from(this.remoteUsers.values());
  }

  // Check if initialized
  isInCall(): boolean {
    return this.isInitialized && this.client !== null;
  }

  // Get local tracks
  getLocalTracks() {
    return this.localTracks;
  }
}

export default VideoAPI.getInstance();
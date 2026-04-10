// ==============================================
// AGORA SDK TYPE DECLARATIONS
// ==============================================

declare module 'agora-rtc-sdk-ng' {
  export interface IAgoraRTC {
    createClient(config: ClientConfig): IAgoraRTCClient;
    createMicrophoneAndCameraTracks(
      audioConfig?: AudioConfig,
      videoConfig?: VideoConfig
    ): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]>;
    createMicrophoneAudioTrack(config?: AudioConfig): Promise<IMicrophoneAudioTrack>;
    createCameraVideoTrack(config?: VideoConfig): Promise<ICameraVideoTrack>;
    createScreenVideoTrack(
      config?: ScreenVideoConfig,
      withAudio?: 'enable' | 'disable' | 'auto'
    ): Promise<IScreenVideoTrack | [IScreenVideoTrack, IMicrophoneAudioTrack]>;
    getCameras(): Promise<MediaDeviceInfo[]>;
    getMicrophones(): Promise<MediaDeviceInfo[]>;
    getPlaybackDevices(): Promise<MediaDeviceInfo[]>;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    checkSystemRequirements(): {
      audio: boolean;
      video: boolean;
      screenSharing: boolean;
      webRTC: boolean;
    };
    setLogLevel(level: LogLevel): void;
    enableLogUpload(): void;
    disableLogUpload(): void;
  }

  export interface IAgoraRTCClient {
    uid: number;
    channelName: string;
    connectionState: ConnectionState;
    localTracks: IAgoraRTCRemoteUser[];
    remoteUsers: IAgoraRTCRemoteUser[];
    join(
      appid: string,
      channel: string,
      token: string | null,
      uid?: string | number | null
    ): Promise<number>;
    leave(): Promise<void>;
    publish(tracks: IAgoraRTCTrack | IAgoraRTCTrack[]): Promise<void>;
    unpublish(tracks: IAgoraRTCTrack | IAgoraRTCTrack[]): Promise<void>;
    subscribe<T extends IAgoraRTCRemoteUser>(
      user: T,
      mediaType: 'audio' | 'video'
    ): Promise<void>;
    unsubscribe<T extends IAgoraRTCRemoteUser>(
      user: T,
      mediaType?: 'audio' | 'video'
    ): Promise<void>;
    setClientRole(role: ClientRole): Promise<void>;
    setRemoteVideoPlayerType(type: VideoPlayerType): void;
    enableDualStream(): Promise<void>;
    disableDualStream(): Promise<void>;
    setLowStreamParameter(streamParameter: LowStreamParameter): void;
    setRemoteDefaultVideoQuality(quality: VideoQuality): void;
    renewToken(token: string): Promise<void>;
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    off(event: string, listener?: Function): void;
    removeAllListeners(event?: string): void;
  }

  export interface IAgoraRTCRemoteUser {
    uid: number;
    hasAudio: boolean;
    hasVideo: boolean;
    audioTrack?: IRemoteAudioTrack;
    videoTrack?: IRemoteVideoTrack;
    getAudioLevel(): number;
    getStats(): RemoteUserStats;
    getMediaStream(): MediaStream;
  }

  export interface IAgoraRTCTrack {
    getTrackId(): string;
    getMediaStreamTrack(): MediaStreamTrack;
    getStats(): TrackStats;
    setEnabled(enabled: boolean): Promise<void>;
    setMuted(muted: boolean): Promise<void>;
    close(): void;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
  }

  export interface ILocalAudioTrack extends IAgoraRTCTrack {
    setVolume(volume: number): void;
    getVolumeLevel(): number;
    setDevice(deviceId: string): Promise<void>;
    setAudioEffect(effect: AudioEffect): void;
    setVoiceConversionOptions(options: VoiceConversionOptions): void;
  }

  export interface ILocalVideoTrack extends IAgoraRTCTrack {
    setDevice(deviceId: string): Promise<void>;
    setEncoderConfiguration(config: VideoEncoderConfiguration): void;
    setOptimizationMode(mode: OptimizationMode): void;
    setMirror(mirror: boolean): void;
    play(element: string | HTMLElement, config?: VideoPlayerConfig): void;
    stop(): void;
  }

  export interface IMicrophoneAudioTrack extends ILocalAudioTrack {
    setMicrophone(deviceId: string): Promise<void>;
  }

  export interface ICameraVideoTrack extends ILocalVideoTrack {
    setCamera(deviceId: string): Promise<void>;
  }

  export interface IScreenVideoTrack extends ILocalVideoTrack {
    stop(): void;
    close(): void;
  }

  export interface IRemoteAudioTrack extends IAgoraRTCTrack {
    play(): void;
    stop(): void;
    getVolumeLevel(): number;
  }

  export interface IRemoteVideoTrack extends IAgoraRTCTrack {
    play(element: string | HTMLElement, config?: VideoPlayerConfig): void;
    stop(): void;
  }

  export interface ClientConfig {
    mode: 'live' | 'rtc';
    codec: 'h264' | 'vp8' | 'vp9';
    audioProfile?: AudioProfile;
    videoEncoderConfiguration?: VideoEncoderConfiguration;
    proxyServer?: string;
    turnServer?: TurnServerConfig;
    httpRetryConfig?: HttpRetryConfig;
    websocketRetryConfig?: WebsocketRetryConfig;
    logLevel?: LogLevel;
  }

  export interface AudioConfig {
    sampleRate?: number;
    channelCount?: number;
    bitrate?: number;
    volume?: number;
    AEC?: boolean;
    AGC?: boolean;
    ANS?: boolean;
    audioProfile?: AudioProfile;
    deviceId?: string;
    microphoneId?: string;
  }

  export interface VideoConfig {
    resolution?: VideoResolution;
    frameRate?: number;
    bitrate?: number;
    optimizationMode?: OptimizationMode;
    deviceId?: string;
    cameraId?: string;
    facingMode?: 'user' | 'environment';
  }

  export interface ScreenVideoConfig {
    encoderConfig?: ScreenEncoderConfig;
    screenSourceId?: string;
    systemAudio?: 'include' | 'exclude';
    captureMouseCursor?: boolean;
  }

  export interface VideoResolution {
    width: number;
    height: number;
  }

  export interface VideoEncoderConfiguration {
    width?: number;
    height?: number;
    frameRate?: number;
    bitrate?: number;
    orientationMode?: 'adaptative' | 'fixedPortrait' | 'fixedLandscape';
  }

  export interface VideoPlayerConfig {
    mirror?: boolean;
    fit?: 'cover' | 'contain' | 'fill';
  }

  export interface LowStreamParameter {
    width: number;
    height: number;
    framerate: number;
    bitrate: number;
  }

  export interface RemoteUserStats {
    uid: number;
    audioStats: AudioStats;
    videoStats: VideoStats;
    transportStats: TransportStats;
  }

  export interface TrackStats {
    codecType: string;
    end2EndDelay: number;
    frameRate?: number;
    freezeCount?: number;
    freezeTime?: number;
    lostRate: number;
    packetLossRate: number;
    publishDuration: number;
    resolutionWidth?: number;
    resolutionHeight?: number;
    receiveBitrate: number;
    receiveBytes: number;
    rtt: number;
    sendBitrate: number;
    sendBytes: number;
  }

  export interface AudioStats {
    codecType: string;
    end2EndDelay: number;
    lostRate: number;
    packetLossRate: number;
    publishDuration: number;
    receiveBitrate: number;
    receiveBytes: number;
    rtt: number;
    sendBitrate: number;
    sendBytes: number;
    volume: number;
  }

  export interface VideoStats {
    codecType: string;
    end2EndDelay: number;
    frameRate: number;
    freezeCount: number;
    freezeTime: number;
    lostRate: number;
    packetLossRate: number;
    publishDuration: number;
    receiveBitrate: number;
    receiveBytes: number;
    receiveFrameRate: number;
    receiveResolutionHeight: number;
    receiveResolutionWidth: number;
    rtt: number;
    sendBitrate: number;
    sendBytes: number;
    sendFrameRate: number;
    sendResolutionHeight: number;
    sendResolutionWidth: number;
  }

  export interface TransportStats {
    rtt: number;
    packetLossRate: number;
    networkType?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
    outboundAvailableBandwidth?: number;
  }

  export interface TurnServerConfig {
    turnServerURL: string;
    username: string;
    password: string;
    udpport?: number;
    tcpport?: number;
    forceturn?: boolean;
  }

  export interface HttpRetryConfig {
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
    maxTimeout?: number;
  }

  export interface WebsocketRetryConfig {
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
  }

  export interface AudioEffect {
    pitch?: number;
    speed?: number;
    reverb?: boolean;
    echo?: boolean;
    voiceChanger?: 'OLDMAN' | 'BABYBOY' | 'BABYGIRL' | 'ZHUBAJIE' | 'ETHEREAL' | 'HULK';
  }

  export interface VoiceConversionOptions {
    pitch?: number;
    tone?: number;
    formant?: number;
  }

  export type ClientRole = 'host' | 'audience';
  export type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'CONNECTED';
  export type VideoPlayerType = 'VP8' | 'H264' | 'H265' | 'VP9';
  export type VideoQuality = 'low' | 'standard' | 'high';
  export type AudioProfile = 'speech_low_quality' | 'speech_standard' | 'music_standard' | 'standard_stereo' | 'high_quality' | 'high_quality_stereo';
  export type OptimizationMode = 'balanced' | 'detail' | 'motion';
  export type ScreenEncoderConfig = '480p_1' | '480p_2' | '720p_1' | '720p_2' | '1080p_1' | '1080p_2';
  export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'none';

  const AgoraRTC: IAgoraRTC;
  export default AgoraRTC;
}

// ==============================================
// AGORA RTM SDK TYPE DECLARATIONS
// ==============================================

declare module 'agora-rtm-sdk' {
  export interface IAgoraRTM {
    createInstance(appId: string, config?: RTMConfig): IAgoraRTMClient;
  }

  export interface IAgoraRTMClient {
    login(params: RTMLoginParams): Promise<void>;
    logout(): Promise<void>;
    queryPeersOnlineStatus(peerIds: string[]): Promise<RTMPeerOnlineStatus>;
    subscribePeersOnlineStatus(peerIds: string[]): Promise<void>;
    unsubscribePeersOnlineStatus(peerIds: string[]): Promise<void>;
    createChannel(channelId: string): IAgoraRTMChannel;
    getChannelAttributes(channelId: string): Promise<RTMAttributes>;
    setChannelAttributes(channelId: string, attributes: Record<string, string>): Promise<void>;
    addOrUpdateLocalUserAttributes(attributes: Record<string, string>): Promise<void>;
    getUserAttributes(userId: string): Promise<Record<string, string>>;
    sendMessageToPeer(
      message: RTMMessage,
      peerId: string,
      options?: RTMPeerMessageOptions
    ): Promise<RTMPeerMessageResult>;
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    off(event: string, listener?: Function): void;
  }

  export interface IAgoraRTMChannel {
    channelId: string;
    join(): Promise<void>;
    leave(): Promise<void>;
    sendMessage(message: RTMMessage, options?: RTMMessageOptions): Promise<void>;
    getMembers(): Promise<string[]>;
    getAttributes(): Promise<RTMAttributes>;
    addOrUpdateAttributes(attributes: Record<string, string>): Promise<void>;
    deleteAttributesByKeys(attributeKeys: string[]): Promise<void>;
    clearAttributes(): Promise<void>;
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    off(event: string, listener?: Function): void;
  }

  export interface RTMConfig {
    logLevel?: RTMLogLevel;
    presenceTimeout?: number;
    heartBeatInterval?: number;
    enableCloudProxy?: boolean;
  }

  export interface RTMLoginParams {
    token?: string;
    uid: string;
  }

  export interface RTMMessage {
    text?: string;
    rawMessage?: Uint8Array;
    description?: string;
  }

  export interface RTMMessageOptions {
    enableHistoricalMessaging?: boolean;
    enableOfflineMessaging?: boolean;
    willReceiveOfflineMessages?: boolean;
  }

  export interface RTMPeerMessageOptions {
    enableOfflineMessaging?: boolean;
    enableHistoricalMessaging?: boolean;
  }

  export interface RTMPeerMessageResult {
    hasPeerReceived: boolean;
    peerOnlineStatus?: boolean;
  }

  export interface RTMAttributes {
    [key: string]: {
      value: string;
      lastUpdateTs: number;
    };
  }

  export interface RTMPeerOnlineStatus {
    [peerId: string]: boolean;
  }

  export type RTMLogLevel = 'trace' | 'debug' | 'info' | 'warning' | 'error' | 'none';

  const AgoraRTM: IAgoraRTM;
  export default AgoraRTM;
}

// ==============================================
// AGORA TOKEN GENERATOR TYPES
// ==============================================

declare module 'agora-access-token' {
  export enum RtcRole {
    PUBLISHER = 1,
    SUBSCRIBER = 2
  }

  export enum RtmRole {
    RTM_User = 1
  }

  export class RtcTokenBuilder {
    static buildTokenWithUid(
      appId: string,
      appCertificate: string,
      channelName: string,
      uid: number,
      role: RtcRole,
      privilegeExpiredTs: number
    ): string;

    static buildTokenWithUserAccount(
      appId: string,
      appCertificate: string,
      channelName: string,
      userAccount: string,
      role: RtcRole,
      privilegeExpiredTs: number
    ): string;
  }

  export class RtmTokenBuilder {
    static buildToken(
      appId: string,
      appCertificate: string,
      userAccount: string,
      role: RtmRole,
      privilegeExpiredTs: number
    ): string;
  }

  export class AccessToken {
    constructor(appId: string, appCertificate: string, channelName: string, uid: string | number);
    addPrivilege(privilege: Privilege, expireTimestamp: number): void;
    build(): string;
  }

  export enum Privilege {
    kJoinChannel = 1,
    kPublishAudioStream = 2,
    kPublishVideoStream = 3,
    kPublishDataStream = 4,
    kRtmLogin = 1000
  }
}

// ==============================================
// VIDEO CALL CUSTOM TYPES
// ==============================================

export interface VideoCallConfig {
  appId: string;
  channel: string;
  token?: string;
  uid?: string | number;
  role?: 'host' | 'audience';
  mode?: 'live' | 'rtc';
  codec?: 'h264' | 'vp8' | 'vp9';
  audioProfile?: 'speech_low_quality' | 'speech_standard' | 'music_standard' | 'standard_stereo' | 'high_quality' | 'high_quality_stereo';
  videoProfile?: '120p' | '180p' | '240p' | '360p' | '480p' | '720p' | '1080p';
}

export interface VideoCallUser {
  uid: string | number;
  hasAudio: boolean;
  hasVideo: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isHost?: boolean;
  displayName?: string;
  avatar?: string;
  audioLevel?: number;
  videoTrack?: any;
  audioTrack?: any;
  joinTime?: Date;
}

export interface VideoCallStats {
  rtt: number;
  packetLoss: number;
  bitrate: number;
  frameRate?: number;
  resolution?: {
    width: number;
    height: number;
  };
  cpu?: number;
  memory?: number;
  networkQuality?: 'good' | 'fair' | 'poor' | 'bad';
}

export interface ScreenShareInfo {
  isSharing: boolean;
  track?: any;
  sourceId?: string;
  sourceName?: string;
  resolution?: {
    width: number;
    height: number;
  };
}

export interface VideoCallRecording {
  isRecording: boolean;
  recordingId?: string;
  startTime?: Date;
  duration?: number;
  url?: string;
  error?: string;
}

export interface VideoCallMessage {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file' | 'emoji';
  isPrivate?: boolean;
  targetUserId?: string;
}

export interface VideoCallEvent {
  type: 'userJoined' | 'userLeft' | 'muteAudio' | 'muteVideo' | 'screenShareStarted' | 'screenShareStopped' | 'recordingStarted' | 'recordingStopped' | 'message' | 'error';
  userId?: string;
  data?: any;
  timestamp: Date;
}

export interface VideoCallOptions {
  enableAudio?: boolean;
  enableVideo?: boolean;
  enableScreenShare?: boolean;
  enableChat?: boolean;
  enableRecording?: boolean;
  maxParticipants?: number;
  videoQuality?: 'low' | 'standard' | 'high';
  audioQuality?: 'low' | 'standard' | 'high';
  watermark?: boolean;
  backgroundBlur?: boolean;
  virtualBackground?: {
    type: 'blur' | 'image';
    imageUrl?: string;
  };
  beautyFilter?: {
    smoothness?: number;
    brightness?: number;
    sharpness?: number;
  };
}

export interface VideoCallState {
  channel: string;
  joined: boolean;
  users: VideoCallUser[];
  localUser?: VideoCallUser;
  isAudioMuted: boolean;
  isVideoDisabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  stats?: VideoCallStats;
  messages: VideoCallMessage[];
  events: VideoCallEvent[];
  error?: string;
}
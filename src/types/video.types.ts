// src/components/video/types/video.types.ts
export type VideoQuality = 'low' | 'medium' | 'high' | 'hd';
export type AudioDevice = 'microphone' | 'speaker';
export type VideoDevice = 'camera' | 'screen';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'co-host' | 'participant';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  joinTime: string;
  stream?: MediaStream;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
  type: 'text' | 'emoji' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface Recording {
  id: string;
  url: string;
  startTime: string;
  endTime?: string;
  duration: number;
  size: number;
  status: 'recording' | 'paused' | 'stopped';
}

export interface WhiteboardAction {
  id: string;
  userId: string;
  type: 'draw' | 'erase' | 'clear' | 'undo' | 'redo';
  data: any;
  timestamp: string;
}
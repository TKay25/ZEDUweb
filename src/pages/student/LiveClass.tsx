import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, Monitor,
  Hand, PhoneOff, StopCircle, Send
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

// Define interfaces
interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  role: 'teacher' | 'student';
}

interface Participant {
  name: string;
  hand: boolean;
}

export const LiveClass: React.FC = () => {
  const { classId: _classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadClassData();
    setupMediaStream();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChatMessages([
        {
          id: '1',
          user: 'Dr. Sarah Johnson',
          avatar: '/avatars/sarah.jpg',
          message: 'Good morning everyone! Welcome to today\'s live session on Advanced Calculus.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          role: 'teacher'
        },
        {
          id: '2',
          user: 'John M.',
          avatar: '/avatars/john.jpg',
          message: 'Good morning Dr. Johnson!',
          timestamp: new Date(Date.now() - 14 * 60 * 1000),
          role: 'student'
        },
        {
          id: '3',
          user: 'Sarah T.',
          avatar: '/avatars/sarah.jpg',
          message: 'I have a question about the chain rule from last week.',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          role: 'student'
        }
      ]);
    } catch (error) {
      console.error('Failed to load class:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access media devices:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // Implement audio toggle logic
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    // Implement video toggle logic
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    // Implement screen share logic
  };

  const raiseHand = () => {
    setHandRaised(!handRaised);
    // Implement raise hand logic
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      {
        id: Date.now().toString(),
        user: 'You',
        message: message,
        timestamp: new Date(),
        role: 'student'
      }
    ]);
    setMessage('');
  };

  const handleLeaveClass = () => {
    // Implement leave class logic
    window.history.back();
  };

  const participants: Participant[] = [
    { name: 'John M.', hand: true },
    { name: 'Sarah T.', hand: false },
    { name: 'Michael C.', hand: false },
    { name: 'Elizabeth D.', hand: false },
    { name: 'Tafadzwa M.', hand: false }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 relative">
          {/* Main Video */}
          <div className="relative h-full bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Teacher Info Overlay */}
            <div className="absolute top-4 left-4 flex items-center space-x-3 bg-black/50 rounded-lg p-2">
              <Avatar src="/avatars/sarah.jpg" name="Dr. Sarah Johnson" size="sm" />
              <div>
                <p className="text-white font-medium">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-300">Teacher</p>
              </div>
            </div>

            {/* Class Info */}
            <div className="absolute top-4 right-4 bg-black/50 rounded-lg px-3 py-2">
              <p className="text-white font-medium">Advanced Calculus - Live Session</p>
              <p className="text-xs text-gray-300">12 participants • 45:23 remaining</p>
            </div>

            {/* Hand Raised Indicator */}
            {handRaised && (
              <div className="absolute bottom-20 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center">
                <Hand className="w-4 h-4 mr-2" />
                Hand raised
              </div>
            )}

            {/* Control Bar */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-full px-4 py-2 flex items-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full ${
                  audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {audioEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                  videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {videoEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full ${
                  screenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {screenSharing ? <StopCircle className="w-5 h-5 text-white" /> : <Monitor className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={raiseHand}
                className={`p-3 rounded-full ${
                  handRaised ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Hand className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleLeaveClass}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white flex flex-col">
          {/* Custom Tabs */}
          <div className="border-b border-gray-200 px-4 pt-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('participants')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'participants'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Participants
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'chat'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chat
              </button>
            </div>
          </div>

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium mb-3">Teacher</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Avatar src="/avatars/sarah.jpg" name="Dr. Sarah Johnson" size="sm" />
                    <div>
                      <p className="font-medium">Dr. Sarah Johnson</p>
                      <p className="text-xs text-gray-500">Teacher</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Host</Badge>
                </div>
              </div>

              <h3 className="text-sm font-medium mb-3">Students (11)</h3>
              <div className="space-y-2">
                {participants.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <Avatar name={student.name} size="sm" />
                      <span className="text-sm">{student.name}</span>
                    </div>
                    {student.hand && (
                      <Hand className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-3">
                    <Avatar src={msg.avatar} name={msg.user} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{msg.user}</span>
                        {msg.role === 'teacher' && (
                          <Badge size="sm" className="bg-primary-100 text-primary-800">
                            Teacher
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="primary" size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
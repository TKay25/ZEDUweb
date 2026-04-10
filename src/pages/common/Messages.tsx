// src/pages/common/Messages.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Send, Paperclip, Image as ImageIcon,
  FileText, X, Search, MoreVertical, Phone,
  Video, Users, CheckCircle, Clock,
  ChevronLeft, Download
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
//import { userAPI } from '../../api/user.api';
import { messagingAPI } from '../../api/messaging.api';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../hooks/useSocket';

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
    online?: boolean;
    lastSeen?: Date;
  }>;
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
    read: boolean;
  };
  unreadCount: number;
  pinned: boolean;
  archived: boolean;
  muted: boolean;
  updatedAt: Date;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  readBy?: Array<{
    userId: string;
    readAt: Date;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
  reactions?: Array<{
    emoji: string;
    userId: string;
    userName: string;
  }>;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  forwarded: boolean;
  edited: boolean;
  editedAt?: Date;
  deleted: boolean;
  delivered: boolean;
}

export const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { socket, emit, on, off } = useSocket();

  useEffect(() => {
    loadConversations();
    setupSocketListeners();
    
    return () => {
      // Cleanup socket listeners
      off('new-message');
      off('message-read');
      off('typing');
      off('user-online');
      off('user-offline');
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      markConversationAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const response = await messagingAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await messagingAPI.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const setupSocketListeners = () => {
    on('new-message', handleNewMessage);
    on('message-read', handleMessageRead);
    on('typing', handleTyping);
    on('user-online', (userId: string) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });
    on('user-offline', (userId: string) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });
  };

  const handleNewMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    
    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === message.conversationId
          ? {
              ...conv,
              lastMessage: {
                content: message.content,
                timestamp: message.timestamp,
                senderId: message.senderId,
                read: false
              },
              unreadCount: conv.unreadCount + 1
            }
          : conv
      )
    );
  };

  const handleMessageRead = ({ messageId, userId }: { messageId: string; userId: string; conversationId: string }) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              read: true,
              readBy: [...(msg.readBy || []), { userId, readAt: new Date() }]
            }
          : msg
      )
    );
  };

  const handleTyping = ({ userId, isTyping }: { userId: string; conversationId: string; isTyping: boolean }) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markConversationAsRead = async (conversationId: string) => {
    try {
      await messagingAPI.markConversationAsRead(conversationId);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      const formData = new FormData();
      formData.append('content', newMessage);
      formData.append('conversationId', selectedConversation!);
      
      if (replyingTo) {
        formData.append('replyTo', replyingTo.id);
      }

      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await messagingAPI.sendMessage(formData);
      
      if (socket) {
        emit('send-message', {
          conversationId: selectedConversation,
          message: response.data
        });
      }

      setNewMessage('');
      setAttachments([]);
      setReplyingTo(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleTypingIndicator = (isTyping: boolean) => {
    if (socket && selectedConversation) {
      emit('typing', {
        conversationId: selectedConversation,
        isTyping
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const isTypingInCurrentConversation = selectedConversation && typingUsers.has(selectedConversation);

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        {/* Search */}
        <div className="p-4 border-b">
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => {
            const otherParticipants = conv.participants.filter(p => p.id !== 'current-user');
            const name = otherParticipants.map(p => p.name).join(', ');
            const isOnline = otherParticipants.some(p => onlineUsers.has(p.id));
            
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b ${
                  selectedConversation === conv.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    {otherParticipants.length === 1 ? (
                      <Avatar
                        src={otherParticipants[0].avatar}
                        name={otherParticipants[0].name}
                        size="md"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{name}</h3>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <Badge className="mt-1 bg-primary-600 text-white">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setSelectedConversation(null)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                {currentConversation?.participants.filter(p => p.id !== 'current-user').length === 1 ? (
                  <Avatar
                    src={currentConversation?.participants[0].avatar}
                    name={currentConversation?.participants[0].name}
                    size="md"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                )}
                {currentConversation?.participants.some(p => 
                  p.id !== 'current-user' && onlineUsers.has(p.id)
                ) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {currentConversation?.participants
                    .filter(p => p.id !== 'current-user')
                    .map(p => p.name)
                    .join(', ')}
                </h3>
                <p className="text-xs text-gray-500">
                  {isTypingInCurrentConversation ? (
                    <span className="text-primary-600">Typing...</span>
                  ) : (
                    currentConversation?.participants.some(p => 
                      p.id !== 'current-user' && onlineUsers.has(p.id)
                    ) ? 'Online' : 'Offline'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              if (message.deleted) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      This message was deleted
                    </span>
                  </div>
                );
              }

              const isOwn = message.senderId === 'current-user';
              const showDate = index === 0 || 
                format(new Date(messages[index - 1].timestamp), 'yyyy-MM-dd') !== 
                format(message.timestamp, 'yyyy-MM-dd');

              return (
                <React.Fragment key={message.id}>
                  {showDate && (
                    <div className="flex justify-center">
                      <Badge className="bg-gray-100 text-gray-600">
                        {format(message.timestamp, 'MMMM d, yyyy')}
                      </Badge>
                    </div>
                  )}
                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end space-x-2 max-w-[70%] ${
                      isOwn ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {!isOwn && (
                        <Avatar
                          src={message.senderAvatar}
                          name={message.senderName}
                          size="sm"
                        />
                      )}
                      <div>
                        {message.replyTo && (
                          <div className="mb-1 p-2 bg-gray-100 rounded text-sm">
                            <p className="text-xs text-gray-500">Replying to {message.replyTo.senderName}</p>
                            <p className="text-gray-600">{message.replyTo.content}</p>
                          </div>
                        )}
                        <div className={`p-3 rounded-lg ${
                          isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100'
                        }`}>
                          <p>{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map(att => (
                                <a
                                  key={att.id}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center p-2 rounded ${
                                    isOwn ? 'bg-primary-700' : 'bg-white'
                                  }`}
                                >
                                  {att.type.startsWith('image/') ? (
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                  ) : (
                                    <FileText className="w-4 h-4 mr-2" />
                                  )}
                                  <span className="text-sm flex-1 truncate">{att.name}</span>
                                  <Download className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center mt-1 text-xs ${
                          isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-gray-500">
                            {format(message.timestamp, 'h:mm a')}
                          </span>
                          {message.edited && (
                            <span className="text-gray-400 ml-1">(edited)</span>
                          )}
                          {isOwn && (
                            <span className="ml-2">
                              {message.read ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : message.delivered ? (
                                <CheckCircle className="w-3 h-3 text-gray-400" />
                              ) : (
                                <Clock className="w-3 h-3 text-gray-400" />
                              )}
                            </span>
                          )}
                        </div>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex mt-1 space-x-1">
                            {message.reactions.map((reaction, i) => (
                              <button
                                key={i}
                                className="px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                              >
                                {reaction.emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Indicator */}
          {replyingTo && (
            <div className="px-4 py-2 bg-gray-100 border-t flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Replying to {replyingTo.senderName}</p>
                <p className="text-sm truncate">{replyingTo.content}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center bg-white rounded-lg px-3 py-1 border">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-4 h-4 text-gray-500 mr-2" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                  )}
                  <span className="text-sm">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTypingIndicator(e.target.value.length > 0);
                  }}
                  onBlur={() => handleTypingIndicator(false)}
                  placeholder="Type a message..."
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && attachments.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No conversation selected</h3>
            <p className="text-gray-500">Choose a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};
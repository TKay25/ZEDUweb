import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Hook for real-time messaging in a specific conversation
export function useConversation(conversationId: string) {
  const { socket, emit, on, off, isConnected } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!conversationId || !socket) return;

    // Join conversation room
    emit('join:conversation', conversationId);

    // Listen for new messages
    on('message:new', (message: any) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing indicators
    on('typing:start', ({ userId }: { userId: string }) => {
      setTypingUsers(prev => new Set([...prev, userId]));
    });

    on('typing:stop', ({ userId }: { userId: string }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Listen for read receipts
    on('message:read', ({ messageId, userId }: { messageId: string; userId: string }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, readBy: [...(msg.readBy || []), userId] }
            : msg
        )
      );
    });

    return () => {
      emit('leave:conversation', conversationId);
      off('message:new');
      off('typing:start');
      off('typing:stop');
      off('message:read');
    };
  }, [conversationId, socket]);

  const sendMessage = useCallback((content: string, attachments?: File[]) => {
    emit('message:send', {
      conversationId,
      content,
      attachments,
      timestamp: new Date()
    });
  }, [conversationId, emit]);

  const sendTyping = useCallback((typing: boolean) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Update local typing state
    setIsTyping(typing);

    emit('typing', {
      conversationId,
      typing
    });

    if (typing) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        emit('typing', {
          conversationId,
          typing: false
        });
      }, 3000);
    }
  }, [conversationId, emit]);

  const markAsRead = useCallback((messageId: string) => {
    emit('message:read', {
      conversationId,
      messageId
    });
  }, [conversationId, emit]);

  return {
    messages,
    typingUsers,
    isTyping,
    isConnected,
    sendMessage,
    sendTyping,
    markAsRead
  };
}

// Hook for presence tracking
export function usePresence(userId: string) {
  const { socket, on, off } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!socket || !userId) return;

    on('presence:online', ({ userId: onlineUserId }: { userId: string }) => {
      if (onlineUserId === userId) {
        setIsOnline(true);
        setLastSeen(new Date());
      }
    });

    on('presence:offline', ({ userId: offlineUserId, lastSeen: lastSeenTime }: { userId: string; lastSeen: Date }) => {
      if (offlineUserId === userId) {
        setIsOnline(false);
        setLastSeen(new Date(lastSeenTime));
      }
    });

    // Request initial presence
    socket.emit('presence:check', userId);

    return () => {
      off('presence:online');
      off('presence:offline');
    };
  }, [userId, socket]);

  return { isOnline, lastSeen };
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const { socket, on, off } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!socket) return;

    on('notification', (notification: any) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      off('notification');
    };
  }, [socket]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    clearNotifications
  };
}

// Hook for room-based collaboration
export function useRoom(roomId: string) {
  const { socket, emit, on, off, isConnected } = useSocket();
  const [participants, setParticipants] = useState<string[]>([]);
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    if (!roomId || !socket) return;

    emit('join:room', roomId);

    on('room:joined', ({ userId }: { userId: string }) => {
      setParticipants(prev => [...prev, userId]);
    });

    on('room:left', ({ userId }: { userId: string }) => {
      setParticipants(prev => prev.filter(id => id !== userId));
    });

    on('room:data', (data: any) => {
      setRoomData(data);
    });

    return () => {
      emit('leave:room', roomId);
      off('room:joined');
      off('room:left');
      off('room:data');
    };
  }, [roomId, socket]);

  const sendRoomData = useCallback((data: any) => {
    emit('room:data', { roomId, data });
  }, [roomId, emit]);

  return {
    participants,
    roomData,
    isConnected,
    sendRoomData
  };
}
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: <T = any>(event: string, data?: T) => void;
  on: <T = any>(event: string, callback: (data: T) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  onlineUsers: string[];
  typingUsers: Map<string, { userId: string; isTyping: boolean }>;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Socket URL from environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, { userId: string; isTyping: boolean }>>(new Map());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const { user, isAuthenticated } = useAuth();

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setReconnectAttempts(0);
      
      // Join user's personal room
      socketInstance.emit('join:user', user.id);
      
      // Join role-based room
      socketInstance.emit('join:role', user.role);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, attempt to reconnect
        setTimeout(() => {
          socketInstance.connect();
        }, 1000);
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setReconnectAttempts(prev => prev + 1);
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Unable to establish real-time connection. Some features may be limited.');
      }
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      
      // Rejoin rooms after reconnect
      socketInstance.emit('join:user', user.id);
      socketInstance.emit('join:role', user.role);
    });

    socketInstance.on('users:online', (users: string[]) => {
      setOnlineUsers(users);
    });

    socketInstance.on('user:online', (userId: string) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
    });

    socketInstance.on('user:offline', (userId: string) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    socketInstance.on('typing:start', ({ room, userId }: { room: string; userId: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.set(room, { userId, isTyping: true });
        return newMap;
      });
    });

    socketInstance.on('typing:stop', ({ room }: { room: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(room);
        return newMap;
      });
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      socketInstance.removeAllListeners();
    };
  }, [user, isAuthenticated, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const emit = useCallback(<T = any>(event: string, data?: T) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }, [socket, isConnected]);

  const on = useCallback(<T = any>(event: string, callback: (data: T) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  const joinRoom = useCallback((room: string) => {
    emit('join:room', { room, userId: user?.id });
  }, [emit, user]);

  const leaveRoom = useCallback((room: string) => {
    emit('leave:room', { room, userId: user?.id });
  }, [emit, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user]);

  const value = {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
    onlineUsers,
    typingUsers
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Custom hook for real-time messaging
export const useMessaging = (conversationId: string) => {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!conversationId || !socket) return;

    // Join conversation room
    emit('join:conversation', conversationId);

    // Listen for new messages
    on('message:new', (message: any) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for message updates
    on('message:updated', (updatedMessage: any) => {
      setMessages(prev =>
        prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
      );
    });

    // Listen for message deletions
    on('message:deleted', ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    // Listen for typing indicators
    on('typing', ({ userId, typing }: { userId: string; typing: boolean }) => {
      if (userId !== conversationId) {
        setIsTyping(typing);
      }
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
      off('message:updated');
      off('message:deleted');
      off('typing');
      off('message:read');
    };
  }, [conversationId, socket, emit, on, off]);

  const sendMessage = useCallback((content: string, attachments?: File[]) => {
    emit('message:send', {
      conversationId,
      content,
      attachments,
      timestamp: new Date()
    });
  }, [conversationId, emit]);

  const editMessage = useCallback((messageId: string, content: string) => {
    emit('message:edit', {
      conversationId,
      messageId,
      content,
      editedAt: new Date()
    });
  }, [conversationId, emit]);

  const deleteMessage = useCallback((messageId: string) => {
    emit('message:delete', {
      conversationId,
      messageId
    });
  }, [conversationId, emit]);

  const markAsRead = useCallback((messageId: string) => {
    emit('message:read', {
      conversationId,
      messageId
    });
  }, [conversationId, emit]);

  const sendTyping = useCallback((typing: boolean) => {
    emit('typing', {
      conversationId,
      typing
    });
  }, [conversationId, emit]);

  return {
    messages,
    isTyping,
    onlineStatus,
    isConnected,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    sendTyping
  };
};

// Custom hook for presence (online/offline) tracking
export const usePresence = (userId: string) => {
  const { socket, on, off, emit } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!socket || !userId) return;

    // Check initial status
    emit('presence:check', userId);

    // Listen for presence updates
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

    return () => {
      off('presence:online');
      off('presence:offline');
    };
  }, [userId, socket, emit, on, off]);

  return { isOnline, lastSeen };
};
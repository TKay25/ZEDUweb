// src/components/ai/AITutorChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
// Fix: Use type-only import for types
import type { ChatMessage, ChatSession } from './types/ai.types';
// Import the API
import aiAPI from '../../api/ai.api';

interface AITutorChatProps {
  sessionId?: string;
  subject?: string;
  initialMessage?: string;
  onSessionCreate?: (session: ChatSession) => void;
  className?: string;
}

const AITutorChat: React.FC<AITutorChatProps> = ({
  sessionId: initialSessionId,
  subject = 'General',
  initialMessage = "Hi! I'm your AI tutor. How can I help you today?",
  onSessionCreate,
  className = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Can you explain this topic?',
        'Give me a practice question',
        'I need help with my homework',
        'Create a study plan for me',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [isTyping, setIsTyping] = useState(false);
  // Fix: Remove unused state
  // const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      loadChatHistory();
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!sessionId) return;
    try {
      const session = await aiAPI.getChatHistory(sessionId);
      // Fix: Type conversion - ensure messages match the expected type
      const formattedMessages: ChatMessage[] = session.messages.map(msg => ({
        ...msg,
        // Ensure role is only 'user' or 'assistant' (remove 'system' if present)
        role: msg.role === 'system' ? 'assistant' : msg.role as 'user' | 'assistant'
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await aiAPI.sendMessage(userMessage.content, sessionId);
      
      if (!sessionId && response.sessionId) {
        setSessionId(response.sessionId);
        // Fetch the full session
        const newSession = await aiAPI.getChatHistory(response.sessionId);
        if (onSessionCreate) {
          // Fix: Convert session if needed
          const formattedSession: ChatSession = {
            ...newSession,
            messages: newSession.messages.map(msg => ({
              ...msg,
              role: msg.role === 'system' ? 'assistant' : msg.role as 'user' | 'assistant'
            }))
          };
          onSessionCreate(formattedSession);
        }
      }

      // Generate follow-up suggestions based on context
      const suggestions = await generateSuggestions(response.content);

      const assistantMessage: ChatMessage = {
        id: response.id || Date.now().toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        suggestions,
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
      setMessages((prev) => [...prev, assistantMessage]);
      // Fix: Remove unused setSuggestedQuestions
      // setSuggestedQuestions(suggestions);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        )
      );

      // Add error message from assistant
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Fix: Use the response parameter
  const generateSuggestions = async (_response: string): Promise<string[]> => {
    // Generate contextual suggestions based on the conversation
    const suggestions = [
      'Tell me more about this',
      'Give me an example',
      'How can I practice this?',
      'What should I learn next?',
    ];
    return suggestions;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Spinner size="xs" />;
      case 'error':
        return <span className="text-red-500">⚠️</span>;
      default:
        return null;
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] ${className}`} variant="elevated">
      {/* Chat Header */}
      <Card.Header className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            size="lg"
            name="AI Tutor"
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Tutor
              </h3>
              <Badge variant="primary" size="sm">Active</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Subject: {subject} • Online
            </p>
          </div>
          <Button variant="ghost" size="sm" icon={<span>⋯</span>} />
        </div>
      </Card.Header>

      {/* Chat Messages */}
      <Card.Body className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                {message.role === 'assistant' ? (
                  <Avatar size="sm" name="AI" className="bg-gradient-to-r from-blue-500 to-purple-500" />
                ) : (
                  <Avatar size="sm" name="You" />
                )}
              </div>

              {/* Message Content */}
              <div>
                <div
                  className={`
                    rounded-2xl px-4 py-2
                    ${message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }
                    ${message.status === 'error' ? 'opacity-50' : ''}
                  `}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Message Footer */}
                <div
                  className={`flex items-center mt-1 text-xs text-gray-500 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  {getMessageStatusIcon(message.status)}
                </div>

                {/* Suggestion Chips (only for assistant messages) */}
                {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <Avatar size="sm" name="AI" className="bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card.Body>

      {/* Chat Input */}
      <Card.Footer divider className="pt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<span className="text-xl">📎</span>}
            className="!px-2"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<span className="text-xl">😊</span>}
            className="!px-2"
          />
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            size="md"
            fullWidth
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="md"
            icon={<span>➤</span>}
            className="!px-4"
          />
        </div>
      </Card.Footer>
    </Card>
  );
};

export default AITutorChat;
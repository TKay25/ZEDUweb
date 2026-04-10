import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Sparkles,
  HelpCircle, Lightbulb,
  RefreshCw, ThumbsUp, ThumbsDown,
  Copy, Check, Volume2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
//import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AITutor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages([
        {
          id: '1',
          role: 'ai',
          content: 'Hello! I\'m your AI tutor. I can help you with any questions about your courses, explain concepts, provide practice problems, or offer study tips. What would you like help with today?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          suggestions: [
            'Explain calculus derivatives',
            'Help with physics problems',
            'Study tips for exams',
            'Practice math problems'
          ]
        },
        {
          id: '2',
          role: 'user',
          content: 'Can you explain the chain rule in calculus? I\'m having trouble understanding it.',
          timestamp: new Date(Date.now() - 25 * 60 * 1000)
        },
        {
          id: '3',
          role: 'ai',
          content: 'The chain rule is a formula for computing the derivative of a composite function. Think of it as "the derivative of the outside function times the derivative of the inside function."\n\nFor example, if h(x) = f(g(x)), then h\'(x) = f\'(g(x)) × g\'(x).\n\nLet\'s try an example: h(x) = (3x² + 2x)⁵\n- Outside function: f(u) = u⁵, f\'(u) = 5u⁴\n- Inside function: g(x) = 3x² + 2x, g\'(x) = 6x + 2\n- Therefore: h\'(x) = 5(3x² + 2x)⁴ × (6x + 2)',
          timestamp: new Date(Date.now() - 24 * 60 * 1000),
          suggestions: [
            'Give me another example',
            'Practice problems',
            'Explain with video',
            'Related topics'
          ]
        }
      ]);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'That\'s a great question! Let me help you understand this concept better. The key point to remember is that calculus is all about rates of change. When we look at derivatives, we\'re essentially measuring how one quantity changes in relation to another.\n\nWould you like me to break this down further with more examples?',
        timestamp: new Date(),
        suggestions: [
          'More examples',
          'Practice problems',
          'Related concepts',
          'Video explanation'
        ]
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (content: string) => {
    const utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Tutor</h1>
          <p className="text-gray-600 mt-1">
            Your personal AI-powered learning assistant
          </p>
        </div>
        <Badge className="bg-primary-100 text-primary-800 flex items-center">
          <Sparkles className="w-4 h-4 mr-1" />
          Powered by GPT-4
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="col-span-3">
          <Card className="h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                      {message.role === 'ai' ? (
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-600" />
                        </div>
                      ) : (
                        <Avatar name="You" size="sm" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        
                        {/* Message Actions */}
                        <div className={`flex items-center space-x-2 mt-2 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                          {message.role === 'ai' && (
                            <>
                              <button
                                onClick={() => handleCopyMessage(message.content, message.id)}
                                className="p-1 rounded hover:bg-gray-200"
                              >
                                {copiedId === message.id ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              <button
                                onClick={() => handleSpeakMessage(message.content)}
                                className="p-1 rounded hover:bg-gray-200"
                              >
                                <Volume2 className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 rounded hover:bg-gray-200">
                                <ThumbsUp className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-1 rounded hover:bg-gray-200">
                                <ThumbsDown className="w-4 h-4 text-gray-500" />
                              </button>
                            </>
                          )}
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setInput(suggestion)}
                              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
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
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your studies..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="h-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                I can help with homework, explain concepts, provide examples, and offer study tips.
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          {/* Quick Topics */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Quick Topics</h3>
            <div className="space-y-2">
              {[
                'Calculus Derivatives',
                'Physics Formulas',
                'Essay Writing Tips',
                'Exam Preparation',
                'Study Techniques',
                'Problem Solving'
              ].map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setInput(`Tell me about ${topic}`)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center"
                >
                  <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                  {topic}
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Sessions */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Recent Sessions</h3>
            <div className="space-y-3">
              {[
                { topic: 'Chain Rule', date: '2 hours ago' },
                { topic: 'Newton\'s Laws', date: 'Yesterday' },
                { topic: 'Essay Structure', date: '2 days ago' }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{session.topic}</p>
                    <p className="text-xs text-gray-500">{session.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4 bg-primary-50">
            <div className="flex items-start space-x-2">
              <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-primary-800 mb-1">Pro Tip</h4>
                <p className="text-xs text-primary-700">
                  Ask me to explain concepts in different ways if you don't understand the first explanation. I can also provide practice problems with step-by-step solutions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
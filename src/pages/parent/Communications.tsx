import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Mail, Phone, Send,
  Paperclip, Search,
  CheckCircle,
  Calendar,
  Image as ImageIcon, FileText, X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import parentAPI from '../../api/parent.api';
import type { Conversation, Contact, Message } from '../../api/parent.api';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Communications: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [newMessageAttachments, setNewMessageAttachments] = useState<File[]>([]);
  const [sendingNewMessage, setSendingNewMessage] = useState(false);

  useEffect(() => {
    loadCommunications();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      markAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const loadCommunications = async () => {
    try {
      const [conversationsRes, contactsRes] = await Promise.all([
        parentAPI.getConversations(),
        parentAPI.getContacts()
      ]);
      setConversations(conversationsRes);
      setContacts(contactsRes);
    } catch (error) {
      toast.error('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await parentAPI.getMessages(conversationId);
      setMessages(response);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await parentAPI.markAsRead(conversationId);
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
      setSending(true);
      const formData = new FormData();
      formData.append('content', newMessage);
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      await parentAPI.sendMessage(selectedConversation!, formData);
      
      // Reload messages to get the actual message from server
      await loadMessages(selectedConversation!);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendNewMessage = async () => {
    if (!newMessageRecipient || (!newMessageContent.trim() && newMessageAttachments.length === 0)) return;

    try {
      setSendingNewMessage(true);
      await parentAPI.startNewConversation(
        newMessageRecipient,
        newMessageSubject,
        newMessageContent,
        newMessageAttachments
      );
      
      toast.success('Message sent successfully');
      setShowNewMessageModal(false);
      setNewMessageRecipient('');
      setNewMessageSubject('');
      setNewMessageContent('');
      setNewMessageAttachments([]);
      
      // Reload conversations
      await loadCommunications();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendingNewMessage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isNewMessage: boolean = false) => {
    const files = Array.from(e.target.files || []);
    if (isNewMessage) {
      setNewMessageAttachments(prev => [...prev, ...files]);
    } else {
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const removeAttachment = (index: number, isNewMessage: boolean = false) => {
    if (isNewMessage) {
      setNewMessageAttachments(prev => prev.filter((_, i) => i !== index));
    } else {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Communications</h1>
        <Button onClick={() => setShowNewMessageModal(true)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <Card className="col-span-4 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Custom Tabs */}
          <div className="border-b border-gray-200 px-4 pt-2">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contacts
              </button>
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'messages' ? (
              <div className="divide-y">
                {filteredConversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedConversation === conv.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={conv.participant.avatar}
                        name={conv.participant.name}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">
                            {conv.participant.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {conv.participant.subject && (
                            <span className="text-xs text-primary-600 mr-1">
                              {conv.participant.subject}
                            </span>
                          )}
                          {conv.childName && (
                            <span className="text-xs text-gray-400 mr-1">
                              • {conv.childName}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-primary-600 text-white">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {filteredContacts.map(contact => (
                  <div key={contact.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={contact.avatar}
                        name={contact.name}
                        size="md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-gray-600">
                          {contact.role}
                          {contact.subject && ` • ${contact.subject}`}
                          {contact.childName && ` • ${contact.childName}`}
                        </p>
                      </div>
                      {contact.available && (
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNewMessageRecipient(contact.id);
                          setShowNewMessageModal(true);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `mailto:${contact.email}`}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `tel:${contact.phone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-8 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={conversations.find(c => c.id === selectedConversation)?.participant.avatar}
                    name={conversations.find(c => c.id === selectedConversation)?.participant.name || ''}
                    size="md"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {conversations.find(c => c.id === selectedConversation)?.participant.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversations.find(c => c.id === selectedConversation)?.participant.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.senderId === 'parent';
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
                        <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {!isOwn && (
                            <Avatar
                              src={message.senderAvatar}
                              name={message.senderName}
                              size="sm"
                            />
                          )}
                          <div>
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
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                              isOwn ? 'justify-end' : 'justify-start'
                            }`}>
                              <span>{format(message.timestamp, 'h:mm a')}</span>
                              {isOwn && message.read && (
                                <CheckCircle className="w-3 h-3 ml-1 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 mr-2 text-gray-500" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        )}
                        <span className="text-sm">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
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
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                      />
                      <div className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </div>
                    </label>
                    <Button
                      onClick={handleSendMessage}
                      loading={sending}
                      disabled={(!newMessage.trim() && attachments.length === 0) || sending}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">New Message</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Recipient</label>
                <select 
                  value={newMessageRecipient}
                  onChange={(e) => setNewMessageRecipient(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a recipient</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} - {contact.role} {contact.childName ? `(${contact.childName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input 
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                  placeholder="Enter subject" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Textarea 
                  rows={4} 
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  placeholder="Type your message..." 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attachments</label>
                {newMessageAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newMessageAttachments.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 mr-2 text-gray-500" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        )}
                        <span className="text-sm">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index, true)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="new-message-attachments"
                    onChange={(e) => handleFileUpload(e, true)}
                  />
                  <label
                    htmlFor="new-message-attachments"
                    className="cursor-pointer text-primary-600 hover:text-primary-700"
                  >
                    Click to upload files
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewMessageModal(false);
                    setNewMessageRecipient('');
                    setNewMessageSubject('');
                    setNewMessageContent('');
                    setNewMessageAttachments([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendNewMessage}
                  loading={sendingNewMessage}
                  disabled={!newMessageRecipient || (!newMessageContent.trim() && newMessageAttachments.length === 0)}
                >
                  Send Message
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
// src/pages/school/Communications.tsx
import React, { useState, useEffect } from 'react';
import {
  Mail, Send, Users,
  Bell, Plus, Eye, Trash2, CheckCircle,
  AlertCircle, Paperclip,
  Image as ImageIcon, FileText, X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
//import schoolAPI from '../../api/school.api';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'holiday' | 'exam';
  target: 'all' | 'students' | 'teachers' | 'parents' | 'specific';
  targetGroups?: string[];
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: Date;
  expiresAt?: Date;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
  }>;
  readCount: number;
  totalRecipients: number;
}

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  subject: string;
  content: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  sentAt: Date;
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
  status: 'sent' | 'delivered' | 'failed';
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const Communications: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [activeTab, setActiveTab] = useState('announcements');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general',
    target: 'all',
    expiresAt: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    loadCommunications();
  }, []);

  const loadCommunications = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'School Holiday Announcement',
          content: 'School will be closed on Monday for public holiday.',
          type: 'holiday',
          target: 'all',
          createdBy: { id: 'admin1', name: 'Admin User', role: 'Administrator' },
          createdAt: new Date(),
          readCount: 150,
          totalRecipients: 500
        },
        {
          id: '2',
          title: 'Exam Schedule',
          content: 'Final exams will start next week. Please check the schedule.',
          type: 'exam',
          target: 'students',
          createdBy: { id: 'teacher1', name: 'John Doe', role: 'Teacher' },
          createdAt: new Date(),
          readCount: 300,
          totalRecipients: 400
        }
      ];
      
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: { id: 't1', name: 'John Doe', role: 'Teacher', avatar: '' },
          recipients: [{ id: 's1', name: 'Student', role: 'Student' }],
          subject: 'Assignment Reminder',
          content: 'Please submit your assignments by Friday.',
          sentAt: new Date(),
          readBy: [],
          status: 'sent'
        }
      ];
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'info',
          title: 'New Announcement',
          message: 'A new school announcement has been posted.',
          timestamp: new Date(),
          read: false
        },
        {
          id: '2',
          type: 'success',
          title: 'Message Sent',
          message: 'Your message was sent successfully.',
          timestamp: new Date(),
          read: true
        }
      ];
      
      setAnnouncements(mockAnnouncements);
      setMessages(mockMessages);
      setNotifications(mockNotifications);
    } catch (error) {
      toast.error('Failed to load communications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnnouncement = async () => {
    try {
      // In a real app, you would send to the API
      // const formData = new FormData();
      // Object.entries(newAnnouncement).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      // attachments.forEach(file => {
      //   formData.append('attachments', file);
      // });
      // await schoolAPI.createAnnouncement(formData);
      
      toast.success('Announcement sent successfully');
      setShowNewAnnouncement(false);
      setNewAnnouncement({ title: '', content: '', type: 'general', target: 'all', expiresAt: '' });
      setAttachments([]);
      loadCommunications();
    } catch (error) {
      toast.error('Failed to send announcement');
      console.error(error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // In a real app, you would call the API
      // await schoolAPI.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, you would call the API
      // await schoolAPI.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
      console.error(error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'holiday': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button onClick={() => setShowNewAnnouncement(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Announcements</p>
              <p className="text-2xl font-bold">{announcements.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Messages</p>
              <p className="text-2xl font-bold">{messages.length}</p>
            </div>
            <Mail className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recipients</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Simple Tabs Implementation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'announcements', label: 'Announcements' },
            { id: 'messages', label: 'Messages' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'templates', label: 'Templates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <Card key={announcement.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <Badge className={getAnnouncementTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {announcement.target}
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-3">{announcement.content}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By: {announcement.createdBy.name}</span>
                    <span>•</span>
                    <span>{format(announcement.createdAt, 'MMM d, yyyy h:mm a')}</span>
                    <span>•</span>
                    <span>Read: {announcement.readCount}/{announcement.totalRecipients}</span>
                  </div>

                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {announcement.attachments.map(att => (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.map(message => (
            <Card key={message.id} className="p-4">
              <div className="flex items-start">
                <Avatar
                  src={message.sender.avatar}
                  name={message.sender.name}
                  size="md"
                  className="mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold">{message.subject}</h3>
                      <p className="text-sm text-gray-600">
                        From: {message.sender.name} ({message.sender.role})
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(message.sentAt, { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-gray-700 mt-2">{message.content}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>To: {message.recipients.length} recipients</span>
                      <span className="mx-2">•</span>
                      <Mail className="w-4 h-4" />
                      <span>Read: {message.readBy.length}/{message.recipients.length}</span>
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                      <Badge className="bg-gray-100 text-gray-800">
                        {message.attachments.length} attachments
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.map(notification => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                !notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  notification.type === 'info' ? 'bg-blue-100' :
                  notification.type === 'success' ? 'bg-green-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  {notification.type === 'info' && <Bell className="w-4 h-4 text-blue-600" />}
                  {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                  {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Templates Tab Placeholder */}
      {activeTab === 'templates' && (
        <Card className="p-8 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Message Templates</h3>
          <p className="text-gray-600 mb-4">
            Create and manage reusable message templates for common communications.
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </Card>
      )}

      {/* New Announcement Modal */}
      {showNewAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Announcement</h2>
              <button
                onClick={() => setShowNewAnnouncement(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Announcement title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="event">Event</option>
                    <option value="holiday">Holiday</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience</label>
                  <select
                    value={newAnnouncement.target}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Everyone</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teachers Only</option>
                    <option value="parents">Parents Only</option>
                    <option value="specific">Specific Groups</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <Textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  rows={6}
                  placeholder="Announcement content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expires At (Optional)</label>
                <Input
                  type="datetime-local"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attachments</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="announcement-attachments"
                  />
                  <label
                    htmlFor="announcement-attachments"
                    className="cursor-pointer text-center block"
                  >
                    <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload files</p>
                    <p className="text-xs text-gray-400">PDF, Images, Documents up to 10MB</p>
                  </label>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            {file.type.startsWith('image/') ? (
                              <ImageIcon className="w-4 h-4 text-gray-500 mr-2" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            )}
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewAnnouncement(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSendAnnouncement}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
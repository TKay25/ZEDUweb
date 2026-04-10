// src/pages/ministry/Communications.tsx
import React, { useState, useEffect } from 'react';
import {
  Mail, MessageCircle, Send,
  Bell, Search,
  Plus, Eye, CheckCircle,
  AlertCircle, Paperclip,
  FileText, X,
  Megaphone
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import ministryAPI from '../../api/ministry.api';
import type { Broadcast, BroadcastStats } from '../../api/ministry.api';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export const MinistryCommunications: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [stats, setStats] = useState<BroadcastStats | null>(null);
  const [showNewBroadcast, setShowNewBroadcast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'medium',
    target: 'all',
    channels: [] as string[],
    scheduledFor: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    loadCommunications();
  }, []);

  const loadCommunications = async () => {
    try {
      const [broadcastsData, statsData] = await Promise.all([
        ministryAPI.getBroadcasts(),
        ministryAPI.getBroadcastStats()
      ]);
      setBroadcasts(broadcastsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!newBroadcast.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!newBroadcast.content.trim()) {
      toast.error('Please enter content');
      return;
    }
    if (newBroadcast.channels.length === 0) {
      toast.error('Please select at least one channel');
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(newBroadcast).forEach(([key, value]) => {
        if (key === 'channels') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      await ministryAPI.sendBroadcast(formData);
      toast.success('Broadcast sent successfully');
      setShowNewBroadcast(false);
      // Reset form
      setNewBroadcast({
        title: '',
        content: '',
        type: 'announcement',
        priority: 'medium',
        target: 'all',
        channels: [],
        scheduledFor: ''
      });
      setAttachments([]);
      loadCommunications();
    } catch (error) {
      toast.error('Failed to send broadcast');
    }
  };

  const handleScheduleBroadcast = async (broadcastId: string) => {
    try {
      await ministryAPI.scheduleBroadcast(broadcastId);
      toast.success('Broadcast scheduled');
      loadCommunications();
    } catch (error) {
      toast.error('Failed to schedule broadcast');
    }
  };

  const handleCancelBroadcast = async (broadcastId: string) => {
    try {
      await ministryAPI.cancelBroadcast(broadcastId);
      toast.success('Broadcast cancelled');
      loadCommunications();
    } catch (error) {
      toast.error('Failed to cancel broadcast');
    }
  };

  const handleResendBroadcast = async (broadcastId: string) => {
    try {
      await ministryAPI.resendBroadcast(broadcastId);
      toast.success('Broadcast resent');
      loadCommunications();
    } catch (error) {
      toast.error('Failed to resend broadcast');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className="w-4 h-4" />;
      case 'circular': return <FileText className="w-4 h-4" />;
      case 'directive': return <AlertCircle className="w-4 h-4" />;
      case 'alert': return <Bell className="w-4 h-4" />;
      case 'newsletter': return <Mail className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBroadcasts = broadcasts.filter(broadcast => {
    const matchesSearch = 
      broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broadcast.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || broadcast.type === selectedType;
    
    let matchesTab = true;
    if (activeTab === 'sent') {
      matchesTab = broadcast.status === 'sent';
    } else if (activeTab === 'scheduled') {
      matchesTab = broadcast.status === 'scheduled';
    } else if (activeTab === 'draft') {
      matchesTab = broadcast.status === 'draft';
    }
    
    return matchesSearch && matchesType && matchesTab;
  });

  if (loading || !stats) {
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
        <h1 className="text-2xl font-bold">Ministry Communications</h1>
        <Button onClick={() => setShowNewBroadcast(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Broadcasts</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Delivery Rate</p>
              <p className="text-2xl font-bold text-green-700">{stats.deliveryRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Open Rate</p>
              <p className="text-2xl font-bold text-blue-700">{stats.openRate}%</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Click Rate</p>
              <p className="text-2xl font-bold text-purple-700">{stats.clickRate}%</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Broadcasts</h3>
        <div className="space-y-3">
          {stats.recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  activity.type === 'alert' ? 'bg-red-100' :
                  activity.type === 'announcement' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  {getTypeIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(activity.status)}>
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Input
              placeholder="Search broadcasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="announcement">Announcements</option>
              <option value="circular">Circulars</option>
              <option value="directive">Directives</option>
              <option value="alert">Alerts</option>
              <option value="newsletter">Newsletters</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent ({stats.sent})
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scheduled'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Scheduled ({stats.scheduled})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'draft'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Draft ({stats.draft})
          </button>
        </nav>
      </div>

      {/* Broadcasts List */}
      <div className="space-y-4">
        {filteredBroadcasts.length > 0 ? (
          filteredBroadcasts.map(broadcast => (
            <Card key={broadcast.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      broadcast.type === 'alert' ? 'bg-red-100' :
                      broadcast.type === 'announcement' ? 'bg-green-100' :
                      broadcast.type === 'directive' ? 'bg-purple-100' :
                      'bg-blue-100'
                    }`}>
                      {getTypeIcon(broadcast.type)}
                    </div>
                    <h3 className="text-lg font-semibold">{broadcast.title}</h3>
                    <Badge className={getPriorityColor(broadcast.priority)}>
                      {broadcast.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(broadcast.status)}>
                      {broadcast.status}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-3">{broadcast.content}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <span className="ml-2 font-medium capitalize">{broadcast.target.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Channels:</span>
                      <span className="ml-2 font-medium">
                        {broadcast.channels.map(c => c.toUpperCase()).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created by:</span>
                      <span className="ml-2 font-medium">{broadcast.createdBy.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {broadcast.status === 'scheduled' ? 'Scheduled for:' : 'Sent:'}
                      </span>
                      <span className="ml-2 font-medium">
                        {broadcast.scheduledFor 
                          ? format(new Date(broadcast.scheduledFor), 'MMM d, yyyy h:mm a')
                          : broadcast.sentAt 
                          ? format(new Date(broadcast.sentAt), 'MMM d, yyyy')
                          : format(new Date(broadcast.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  {broadcast.status === 'sent' && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xs text-gray-500">Delivered</p>
                        <p className="text-lg font-bold text-green-600">{broadcast.stats.delivered}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xs text-gray-500">Opened</p>
                        <p className="text-lg font-bold text-blue-600">{broadcast.stats.opened}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xs text-gray-500">Clicked</p>
                        <p className="text-lg font-bold text-purple-600">{broadcast.stats.clicked}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xs text-gray-500">Failed</p>
                        <p className="text-lg font-bold text-red-600">{broadcast.stats.failed}</p>
                      </div>
                    </div>
                  )}

                  {broadcast.attachments && broadcast.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {broadcast.attachments.map(att => (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                        >
                          <Paperclip className="w-3 h-3 mr-1" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {broadcast.status === 'scheduled' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBroadcast(broadcast.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleScheduleBroadcast(broadcast.id)}
                      >
                        Send Now
                      </Button>
                    </>
                  )}
                  {broadcast.status === 'sent' && broadcast.stats.failed > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleResendBroadcast(broadcast.id)}
                    >
                      Resend Failed
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Broadcasts Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first broadcast to get started'}
            </p>
          </Card>
        )}
      </div>

      {/* New Broadcast Modal */}
      {showNewBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">New Broadcast</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <Input
                  value={newBroadcast.title}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                  placeholder="Broadcast title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select
                    value={newBroadcast.type}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="circular">Circular</option>
                    <option value="directive">Directive</option>
                    <option value="alert">Alert</option>
                    <option value="newsletter">Newsletter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority *</label>
                  <select
                    value={newBroadcast.priority}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <Textarea
                  value={newBroadcast.content}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, content: e.target.value })}
                  rows={6}
                  placeholder="Broadcast content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Audience *</label>
                <select
                  value={newBroadcast.target}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, target: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All (National)</option>
                  <option value="provinces">Specific Provinces</option>
                  <option value="districts">Specific Districts</option>
                  <option value="schools">Specific Schools</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Channels *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="email"
                      checked={newBroadcast.channels.includes('email')}
                      onChange={(e) => {
                        const channels = e.target.checked
                          ? [...newBroadcast.channels, 'email']
                          : newBroadcast.channels.filter(c => c !== 'email');
                        setNewBroadcast({ ...newBroadcast, channels });
                      }}
                      className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="sms"
                      checked={newBroadcast.channels.includes('sms')}
                      onChange={(e) => {
                        const channels = e.target.checked
                          ? [...newBroadcast.channels, 'sms']
                          : newBroadcast.channels.filter(c => c !== 'sms');
                        setNewBroadcast({ ...newBroadcast, channels });
                      }}
                      className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    SMS
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="push"
                      checked={newBroadcast.channels.includes('push')}
                      onChange={(e) => {
                        const channels = e.target.checked
                          ? [...newBroadcast.channels, 'push']
                          : newBroadcast.channels.filter(c => c !== 'push');
                        setNewBroadcast({ ...newBroadcast, channels });
                      }}
                      className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Push Notifications
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="portal"
                      checked={newBroadcast.channels.includes('portal')}
                      onChange={(e) => {
                        const channels = e.target.checked
                          ? [...newBroadcast.channels, 'portal']
                          : newBroadcast.channels.filter(c => c !== 'portal');
                        setNewBroadcast({ ...newBroadcast, channels });
                      }}
                      className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Ministry Portal
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Schedule (Optional)</label>
                <Input
                  type="datetime-local"
                  value={newBroadcast.scheduledFor}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, scheduledFor: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Attachments</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setAttachments(prev => [...prev, ...files]);
                    }}
                    className="hidden"
                    id="broadcast-attachments"
                  />
                  <label
                    htmlFor="broadcast-attachments"
                    className="cursor-pointer text-center block"
                  >
                    <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload files</p>
                  </label>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <button
                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
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
                  onClick={() => {
                    setShowNewBroadcast(false);
                    setNewBroadcast({
                      title: '',
                      content: '',
                      type: 'announcement',
                      priority: 'medium',
                      target: 'all',
                      channels: [],
                      scheduledFor: ''
                    });
                    setAttachments([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSendBroadcast}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {newBroadcast.scheduledFor ? 'Schedule' : 'Send Now'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
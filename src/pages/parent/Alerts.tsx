import React, { useState, useEffect } from 'react';
import {
  Bell, AlertCircle, XCircle,
  Clock, Calendar, Award, TrendingUp,
  Users, CheckCheck,
  Trash2, Archive, ChevronRight,
  Download, Settings, BellRing, Mail
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import parentAPI from '../../api/parent.api';
import type { Alert, AlertStats, NotificationPreferences } from '../../api/parent.api';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Alerts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const [alertsRes, statsRes, prefsRes] = await Promise.all([
        parentAPI.getAlerts(),
        parentAPI.getAlertStats(),
        parentAPI.getNotificationPreferences()
      ]);
      setAlerts(alertsRes);
      setStats(statsRes);
      setPreferences(prefsRes);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await parentAPI.markAlertAsRead(alertId);
      setAlerts(prev =>
        prev.map(a =>
          a.id === alertId ? { ...a, read: true } : a
        )
      );
      
      if (stats) {
        setStats({
          ...stats,
          unread: stats.unread - 1
        });
      }
      
      toast.success('Alert marked as read');
    } catch (error) {
      toast.error('Failed to mark alert as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await parentAPI.markAllAlertsAsRead();
      setAlerts(prev =>
        prev.map(a => ({ ...a, read: true }))
      );
      
      if (stats) {
        setStats({
          ...stats,
          unread: 0
        });
      }
      
      toast.success('All alerts marked as read');
    } catch (error) {
      toast.error('Failed to mark alerts as read');
    }
  };

  const handleArchiveAlert = async (alertId: string) => {
    try {
      await parentAPI.archiveAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      
      if (stats) {
        const alert = alerts.find(a => a.id === alertId);
        if (alert) {
          setStats({
            ...stats,
            total: stats.total - 1,
            unread: alert.read ? stats.unread : stats.unread - 1,
            critical: alert.severity === 'critical' ? stats.critical - 1 : stats.critical,
            byType: {
              ...stats.byType,
              [alert.type]: stats.byType[alert.type] - 1
            }
          });
        }
      }
      
      toast.success('Alert archived');
    } catch (error) {
      toast.error('Failed to archive alert');
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await parentAPI.deleteAlert(alertId);
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        
        if (stats) {
          const alert = alerts.find(a => a.id === alertId);
          if (alert) {
            setStats({
              ...stats,
              total: stats.total - 1,
              unread: alert.read ? stats.unread : stats.unread - 1,
              critical: alert.severity === 'critical' ? stats.critical - 1 : stats.critical,
              byType: {
                ...stats.byType,
                [alert.type]: stats.byType[alert.type] - 1
              }
            });
          }
        }
        
        toast.success('Alert deleted');
      } catch (error) {
        toast.error('Failed to delete alert');
      }
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;
    
    try {
      setSavingPreferences(true);
      await parentAPI.updateNotificationPreferences(preferences);
      toast.success('Notification preferences updated');
      setShowSettings(false);
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSavingPreferences(false);
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    const iconClass = `w-5 h-5 ${
      severity === 'critical' ? 'text-red-600' :
      severity === 'warning' ? 'text-yellow-600' :
      severity === 'success' ? 'text-green-600' :
      'text-blue-600'
    }`;
    
    switch (type) {
      case 'grade':
        return <Award className={iconClass} />;
      case 'attendance':
        return <Calendar className={iconClass} />;
      case 'payment':
        return <BellRing className={iconClass} />;
      case 'meeting':
        return <Users className={iconClass} />;
      case 'behavior':
        return <AlertCircle className={iconClass} />;
      case 'announcement':
        return <Bell className={iconClass} />;
      case 'deadline':
        return <Clock className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'grade': return 'Grade Update';
      case 'attendance': return 'Attendance';
      case 'payment': return 'Payment';
      case 'meeting': return 'Meeting';
      case 'behavior': return 'Behavior';
      case 'announcement': return 'Announcement';
      case 'deadline': return 'Deadline';
      default: return type;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alert.archived && activeTab !== 'archived') return false;
    if (!alert.archived && activeTab === 'archived') return false;
    
    if (activeTab === 'unread' && alert.read) return false;
    if (activeTab === 'critical' && alert.severity !== 'critical') return false;
    
    const matchesChild = selectedChild === 'all' || alert.metadata?.childId === selectedChild;
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    
    return matchesChild && matchesType;
  });

  if (loading || !stats || !preferences) {
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
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
          {stats.unread > 0 && (
            <Badge className="bg-primary-600 text-white animate-pulse">
              {stats.unread} new
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={stats.unread === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.unread > 0 ? 'Requires attention' : 'All caught up'}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Immediate attention needed
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Active</p>
              <p className="text-sm font-medium mt-1">
                {Object.entries(stats.byType)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters - Using native select elements */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Children</option>
            <option value="1">John Doe</option>
            <option value="2">Jane Doe</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="grade">Grades</option>
            <option value="attendance">Attendance</option>
            <option value="payment">Payments</option>
            <option value="meeting">Meetings</option>
            <option value="behavior">Behavior</option>
            <option value="announcement">Announcements</option>
            <option value="deadline">Deadlines</option>
          </select>

          <div className="flex-1" />

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </Card>

      {/* Tabs - Using button-based tabs */}
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
            onClick={() => setActiveTab('unread')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'unread'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unread ({stats.unread})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'critical'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Critical ({stats.critical})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'archived'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Archived
          </button>
        </nav>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <Card
              key={alert.id}
              className={`p-4 hover:shadow-md transition-shadow ${
                !alert.read ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''
              }`}
            >
              <div className="flex items-start">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getSeverityColor(alert.severity)}`}>
                  {getAlertIcon(alert.type, alert.severity)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">
                          {getTypeLabel(alert.type)}
                        </Badge>
                      </div>
                      {alert.metadata?.childName && (
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.metadata.childName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(alert.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-2">{alert.message}</p>

                  {/* Metadata Tags */}
                  {alert.metadata && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {alert.metadata.grade && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Grade: {alert.metadata.grade}%
                        </Badge>
                      )}
                      {alert.metadata.amount && (
                        <Badge className="bg-green-100 text-green-800">
                          Amount: ${alert.metadata.amount}
                        </Badge>
                      )}
                      {alert.metadata.dueDate && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Due: {format(new Date(alert.metadata.dueDate), 'MMM d')}
                        </Badge>
                      )}
                      {alert.metadata.subject && (
                        <Badge className="bg-purple-100 text-purple-800">
                          {alert.metadata.subject}
                        </Badge>
                      )}
                      {alert.metadata.teacher && (
                        <Badge className="bg-gray-100 text-gray-800">
                          Teacher: {alert.metadata.teacher}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4">
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark as read
                      </Button>
                    )}
                    
                    {alert.actionUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = alert.actionUrl!}
                      >
                        {alert.actionLabel || 'View Details'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    
                    {!alert.archived && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchiveAlert(alert.id)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Alerts</h3>
            <p className="text-gray-500">
              {activeTab === 'unread' 
                ? "You don't have any unread alerts"
                : activeTab === 'critical'
                ? "No critical alerts at this time"
                : activeTab === 'archived'
                ? "No archived alerts"
                : "You're all caught up! No new alerts to display."}
            </p>
          </Card>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && preferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Notification Preferences</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Delivery Methods */}
              <div>
                <h3 className="font-semibold mb-3">Delivery Methods</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Browser and mobile alerts</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.push}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        push: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.email}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        email: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <BellRing className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-gray-500">Text message for urgent alerts</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.sms}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        sms: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                </div>
              </div>

              {/* Alert Types */}
              <div>
                <h3 className="font-semibold mb-3">Alert Types</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 p-2">
                    <input
                      type="checkbox"
                      checked={preferences.gradeAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        gradeAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Grade Updates</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2">
                    <input
                      type="checkbox"
                      checked={preferences.attendanceAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        attendanceAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Attendance</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2">
                    <input
                      type="checkbox"
                      checked={preferences.paymentAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        paymentAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Payments</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2">
                    <input
                      type="checkbox"
                      checked={preferences.meetingAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        meetingAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Meetings</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2">
                    <input
                      type="checkbox"
                      checked={preferences.behaviorAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        behaviorAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Behavior</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2">
                    <input
                      type="checkbox"
                      checked={preferences.announcementAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        announcementAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Announcements</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2">
                    <input
                      type="checkbox"
                      checked={preferences.deadlineAlerts}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        deadlineAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Deadlines</span>
                  </label>
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <h3 className="font-semibold mb-3">Quiet Hours</h3>
                <label className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    checked={preferences.quietHours.enabled}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      quietHours: {
                        ...preferences.quietHours,
                        enabled: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Do not disturb during specified hours</span>
                </label>

                {preferences.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          quietHours: {
                            ...preferences.quietHours,
                            start: e.target.value
                          }
                        })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          quietHours: {
                            ...preferences.quietHours,
                            end: e.target.value
                          }
                        })}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  loading={savingPreferences}
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
// src/pages/common/Settings.tsx
import React, { useState, useEffect } from 'react';
import {
  Moon, Sun,
   Clock,
  Download, Upload, Trash2,
  Save, RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { settingsAPI } from '../../api/settings.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Settings {
  general: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    animations: boolean;
  };
  notifications: {
    email: {
      marketing: boolean;
      security: boolean;
      updates: boolean;
      newsletter: boolean;
    };
    push: {
      messages: boolean;
      mentions: boolean;
      comments: boolean;
      reminders: boolean;
    };
    sms: {
      alerts: boolean;
      verification: boolean;
      promotions: boolean;
    };
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'contacts' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showActivity: boolean;
    allowTagging: boolean;
    allowMessaging: 'everyone' | 'contacts' | 'none';
    dataSharing: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
    trustedDevices: Array<{
      id: string;
      name: string;
      lastUsed: Date;
      location: string;
    }>;
  };
  preferences: {
    dashboard: {
      defaultView: 'grid' | 'list';
      itemsPerPage: number;
      showStats: boolean;
      showCharts: boolean;
    };
    accessibility: {
      highContrast: boolean;
      fontSize: 'small' | 'medium' | 'large';
      reduceMotion: boolean;
      screenReader: boolean;
    };
  };
  data: {
    autoSave: boolean;
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    storageUsed: number;
    storageLimit: number;
  };
}

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      await settingsAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all settings to default?')) return;
    
    try {
      await settingsAPI.resetSettings();
      await loadSettings();
      toast.success('Settings reset to default');
    } catch (error) {
      toast.error('Failed to reset settings');
    }
  };

  const handleExportData = async () => {
    try {
      await settingsAPI.exportData();
      toast.success('Data export started. You will receive an email when ready.');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) return;
    
    try {
      await settingsAPI.deleteAccount();
      toast.success('Account deleted successfully');
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (loading || !settings) {
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
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['general', 'notifications', 'privacy', 'security', 'preferences', 'data'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'general' ? 'General' :
               tab === 'notifications' ? 'Notifications' :
               tab === 'privacy' ? 'Privacy' :
               tab === 'security' ? 'Security' :
               tab === 'preferences' ? 'Preferences' : 'Data & Storage'}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Display</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, language: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="sn">Shona</option>
                    <option value="nd">Ndebele</option>
                    <option value="fr">French</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Africa/Harare">Africa/Harare (GMT+2)</option>
                    <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date Format</label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, dateFormat: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                    <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                    <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Time Format</label>
                  <select
                    value={settings.general.timeFormat}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, timeFormat: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="12h">12-hour (12:00 PM)</option>
                    <option value="24h">24-hour (13:00)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Theme</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.general.theme === 'light'}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, theme: e.target.value as any }
                      })}
                      className="mr-2"
                    />
                    <Sun className="w-4 h-4 mr-1" />
                    Light
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.general.theme === 'dark'}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, theme: e.target.value as any }
                      })}
                      className="mr-2"
                    />
                    <Moon className="w-4 h-4 mr-1" />
                    Dark
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={settings.general.theme === 'system'}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, theme: e.target.value as any }
                      })}
                      className="mr-2"
                    />
                    <Clock className="w-4 h-4 mr-1" />
                    System
                  </label>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-gray-500">Reduce spacing between elements</p>
                  </div>
                  <Switch
                    checked={settings.general.compactMode}
                    onChange={(checked) => setSettings({
                      ...settings,
                      general: { ...settings.general, compactMode: checked }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Animations</p>
                    <p className="text-sm text-gray-500">Enable UI animations and transitions</p>
                  </div>
                  <Switch
                    checked={settings.general.animations}
                    onChange={(checked) => setSettings({
                      ...settings,
                      general: { ...settings.general, animations: checked }
                    })}
                  />
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing emails</p>
                    <p className="text-sm text-gray-500">Receive product updates and offers</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email.marketing}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: { ...settings.notifications.email, marketing: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security alerts</p>
                    <p className="text-sm text-gray-500">Important security notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email.security}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: { ...settings.notifications.email, security: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Platform updates</p>
                    <p className="text-sm text-gray-500">New features and improvements</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email.updates}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: { ...settings.notifications.email, updates: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-gray-500">Monthly education newsletter</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email.newsletter}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: { ...settings.notifications.email, newsletter: checked }
                      }
                    })}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Direct messages</p>
                    <p className="text-sm text-gray-500">When someone sends you a message</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push.messages}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: { ...settings.notifications.push, messages: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mentions</p>
                    <p className="text-sm text-gray-500">When someone mentions you</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push.mentions}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: { ...settings.notifications.push, mentions: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Comments & replies</p>
                    <p className="text-sm text-gray-500">Activity on your posts</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push.comments}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: { ...settings.notifications.push, comments: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reminders</p>
                    <p className="text-sm text-gray-500">Upcoming events and deadlines</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push.reminders}
                    onChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: { ...settings.notifications.push, reminders: checked }
                      }
                    })}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
              <label className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Do not disturb</p>
                  <p className="text-sm text-gray-500">Mute notifications during specified hours</p>
                </div>
                <Switch
                  checked={settings.notifications.quietHours.enabled}
                  onChange={(checked) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      quietHours: { ...settings.notifications.quietHours, enabled: checked }
                    }
                  })}
                />
              </label>

              {settings.notifications.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 ml-8">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <Input
                      type="time"
                      value={settings.notifications.quietHours.start}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          quietHours: { ...settings.notifications.quietHours, start: e.target.value }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <Input
                      type="time"
                      value={settings.notifications.quietHours.end}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          quietHours: { ...settings.notifications.quietHours, end: e.target.value }
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Who can see your profile?</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisibility: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="public">Public - Anyone</option>
                    <option value="contacts">Contacts Only</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show email address</p>
                      <p className="text-sm text-gray-500">Display your email on profile</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onChange={(checked) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showEmail: checked }
                      })}
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show phone number</p>
                      <p className="text-sm text-gray-500">Display your phone on profile</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showPhone}
                      onChange={(checked) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showPhone: checked }
                      })}
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show location</p>
                      <p className="text-sm text-gray-500">Display your city/country</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showLocation}
                      onChange={(checked) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showLocation: checked }
                      })}
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show activity</p>
                      <p className="text-sm text-gray-500">Display your recent activity</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showActivity}
                      onChange={(checked) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showActivity: checked }
                      })}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Interaction Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Who can message you?</label>
                  <select
                    value={settings.privacy.allowMessaging}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, allowMessaging: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">Contacts only</option>
                    <option value="none">No one</option>
                  </select>
                </div>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow tagging</p>
                    <p className="text-sm text-gray-500">Others can tag you in posts</p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowTagging}
                    onChange={(checked) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, allowTagging: checked }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data sharing</p>
                    <p className="text-sm text-gray-500">Share anonymous usage data</p>
                  </div>
                  <Switch
                    checked={settings.privacy.dataSharing}
                    onChange={(checked) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, dataSharing: checked }
                    })}
                  />
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Authentication</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login alerts</p>
                    <p className="text-sm text-gray-500">Email when new device logs in</p>
                  </div>
                  <Switch
                    checked={settings.security.loginAlerts}
                    onChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, loginAlerts: checked }
                    })}
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium mb-2">Session timeout (minutes)</label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                    min={5}
                    max={120}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Trusted Devices</h3>
              <div className="space-y-3">
                {settings.security.trustedDevices.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-gray-500">
                        Last used {format(new Date(device.lastUsed), 'MMM d, yyyy')} • {device.location}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Preferences */}
      {activeTab === 'preferences' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Dashboard Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Default View</label>
                  <select
                    value={settings.preferences.dashboard.defaultView}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        dashboard: { ...settings.preferences.dashboard, defaultView: e.target.value as any }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Items per page</label>
                  <select
                    value={settings.preferences.dashboard.itemsPerPage}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        dashboard: { ...settings.preferences.dashboard, itemsPerPage: parseInt(e.target.value) }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show statistics</p>
                    <p className="text-sm text-gray-500">Display summary statistics</p>
                  </div>
                  <Switch
                    checked={settings.preferences.dashboard.showStats}
                    onChange={(checked) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        dashboard: { ...settings.preferences.dashboard, showStats: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show charts</p>
                    <p className="text-sm text-gray-500">Display data visualizations</p>
                  </div>
                  <Switch
                    checked={settings.preferences.dashboard.showCharts}
                    onChange={(checked) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        dashboard: { ...settings.preferences.dashboard, showCharts: checked }
                      }
                    })}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Accessibility</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">High contrast</p>
                    <p className="text-sm text-gray-500">Increase color contrast</p>
                  </div>
                  <Switch
                    checked={settings.preferences.accessibility.highContrast}
                    onChange={(checked) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        accessibility: { ...settings.preferences.accessibility, highContrast: checked }
                      }
                    })}
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reduce motion</p>
                    <p className="text-sm text-gray-500">Minimize animations</p>
                  </div>
                  <Switch
                    checked={settings.preferences.accessibility.reduceMotion}
                    onChange={(checked) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        accessibility: { ...settings.preferences.accessibility, reduceMotion: checked }
                      }
                    })}
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium mb-2">Font size</label>
                  <select
                    value={settings.preferences.accessibility.fontSize}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        accessibility: { ...settings.preferences.accessibility, fontSize: e.target.value as any }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Data & Storage */}
      {activeTab === 'data' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Storage Used</span>
                    <span className="text-sm">
                      {(settings.data.storageUsed / 1024 / 1024).toFixed(2)} MB / {(settings.data.storageLimit / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(settings.data.storageUsed / settings.data.storageLimit) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-save</p>
                      <p className="text-sm text-gray-500">Automatically save changes</p>
                    </div>
                    <Switch
                      checked={settings.data.autoSave}
                      onChange={(checked) => setSettings({
                        ...settings,
                        data: { ...settings.data, autoSave: checked }
                      })}
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-backup</p>
                      <p className="text-sm text-gray-500">Regular data backups</p>
                    </div>
                    <Switch
                      checked={settings.data.autoBackup}
                      onChange={(checked) => setSettings({
                        ...settings,
                        data: { ...settings.data, autoBackup: checked }
                      })}
                    />
                  </label>

                  {settings.data.autoBackup && (
                    <div className="ml-8">
                      <label className="block text-sm font-medium mb-1">Backup frequency</label>
                      <select
                        value={settings.data.backupFrequency}
                        onChange={(e) => setSettings({
                          ...settings,
                          data: { ...settings.data, backupFrequency: e.target.value as any }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-800 font-medium mb-3">Are you absolutely sure?</p>
                  <p className="text-sm text-red-600 mb-4">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteAccount}
                    >
                      Yes, delete my account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
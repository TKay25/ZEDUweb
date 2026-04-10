import React, { useState, useEffect } from 'react';
import {
   Mail, Phone, Camera,
  Save, Lock, Bell, Edit2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import parentAPI from '../../api/parent.api';
import { toast } from 'react-hot-toast';

interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  occupation?: string;
  company?: string;
  profilePicture?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    gradeAlerts: boolean;
    attendanceAlerts: boolean;
    paymentReminders: boolean;
    meetingReminders: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    timezone: string;
  };
}

export const ParentProfile: React.FC = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await parentAPI.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      await parentAPI.updateProfile(profile);
      if (updateUser) {
        updateUser(profile as any);
      }
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      try {
        const response = await parentAPI.uploadProfilePicture(formData);
        setProfile({ ...profile, profilePicture: response.url });
        toast.success('Profile picture updated');
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  if (loading || !profile) {
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
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex items-start">
          <div className="relative">
            <Avatar
              src={profile.profilePicture}
              name={`${profile.firstName} ${profile.lastName}`}
              size="xl"
              className="w-24 h-24"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="ml-6 flex-1">
            <h2 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">Parent/Guardian</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-1" />
                {profile.email}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-1" />
                {profile.phone}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Custom Tabs - Using button-based tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </button>
        </nav>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alternative Phone</label>
              <Input
                value={profile.alternativePhone || ''}
                onChange={(e) => setProfile({ ...profile, alternativePhone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Occupation</label>
              <Input
                value={profile.occupation || ''}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <Input
                value={profile.company || ''}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <Input
                value={profile.address.street}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, street: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                value={profile.address.city}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, city: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State/Province</label>
              <Input
                value={profile.address.state}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, state: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <Input
                value={profile.address.postalCode}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, postalCode: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                value={profile.address.country}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, country: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications.email}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, email: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive text messages</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications.sms}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, sms: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Browser notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications.push}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, push: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <h3 className="font-semibold mt-6 mb-4">Alert Preferences</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.notifications.gradeAlerts}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, gradeAlerts: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">Grade updates and report cards</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.notifications.attendanceAlerts}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, attendanceAlerts: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">Attendance notifications</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.notifications.paymentReminders}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, paymentReminders: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">Payment reminders and receipts</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.notifications.meetingReminders}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, meetingReminders: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">Meeting reminders</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={profile.preferences.language}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, language: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="sw">Swahili</option>
                <option value="sn">Shona</option>
                <option value="nd">Ndebele</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={profile.preferences.theme}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, theme: e.target.value as any }
                })}
                disabled={!isEditing}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                value={profile.preferences.timezone}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, timezone: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Africa/Harare">Africa/Harare (GMT+2)</option>
                <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                <option value="America/New_York">America/New York (GMT-4/5)</option>
                <option value="Europe/London">Europe/London (GMT+0/1)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Change Password</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <Button>
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>

          <h3 className="font-semibold mt-8 mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">Setup 2FA</Button>
          </div>

          <h3 className="font-semibold mt-8 mb-4">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-gray-500">
                    Chrome on Windows • Last active now
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-3" />
                <div>
                  <p className="font-medium">Mobile App</p>
                  <p className="text-sm text-gray-500">
                    iPhone 13 • Last active 2 days ago
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Revoke</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
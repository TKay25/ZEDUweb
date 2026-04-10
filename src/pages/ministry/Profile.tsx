// src/pages/ministry/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  Mail, Phone,
  Camera, Save, Edit2,
  Calendar, Bell
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import ministryAPI from '../../api/ministry.api';
import type { MinistryProfile as MinistryProfileType } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const MinistryProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<MinistryProfileType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await ministryAPI.getProfile();
      setProfile(profileData);
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
      await ministryAPI.updateProfile(profile);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await ministryAPI.uploadLogo(formData);
      setProfile({ ...profile, logo: response.url });
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Ministry Profile</h1>
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
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="relative">
            <Avatar
              src={profile.logo}
              name={profile.name}
              size="xl"
              className="w-24 h-24"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">Ministry of Primary and Secondary Education</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-1" />
                {profile.email}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-1" />
                {profile.phone}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Est. {format(new Date(profile.established), 'yyyy')}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Schools</p>
              <p className="text-2xl font-bold">{profile.stats.totalSchools.toLocaleString()}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">S</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Teachers</p>
              <p className="text-2xl font-bold">{profile.stats.totalTeachers.toLocaleString()}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">T</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Students</p>
              <p className="text-2xl font-bold">{profile.stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">St</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Staff</p>
              <p className="text-2xl font-bold">{profile.stats.totalStaff.toLocaleString()}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-lg">Sf</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setActiveTab('regions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'regions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Regions
          </button>
          <button
            onClick={() => setActiveTab('officials')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'officials'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Officials
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
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Email:</span> {profile.email}</p>
                <p><span className="text-gray-500">Phone:</span> {profile.phone}</p>
                <p><span className="text-gray-500">Alternative:</span> {profile.alternativePhone || 'N/A'}</p>
                <p><span className="text-gray-500">Website:</span> {profile.website || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Address</h3>
              <div className="space-y-2">
                <p>{profile.address.street}</p>
                <p>{profile.address.city}, {profile.address.province}</p>
                <p>{profile.address.postalCode}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Minister</h3>
              <div className="space-y-2">
                <p className="font-medium">{profile.minister.name}</p>
                <p className="text-sm text-gray-600">{profile.minister.title}</p>
                <p className="text-sm text-gray-500">Since {format(new Date(profile.minister.since), 'MMMM yyyy')}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Permanent Secretary</h3>
              <div className="space-y-2">
                <p className="font-medium">{profile.permanentSecretary.name}</p>
                <p className="text-sm text-gray-600">{profile.permanentSecretary.email}</p>
                <p className="text-sm text-gray-600">{profile.permanentSecretary.phone}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          {profile.departments.map(dept => (
            <Card key={dept.id} className="p-4">
              <h3 className="font-semibold text-lg">{dept.name}</h3>
              <p className="text-sm text-gray-600 mb-3">Head: {dept.head}</p>
              <div>
                <p className="text-sm font-medium mb-2">Responsibilities:</p>
                <ul className="list-disc list-inside space-y-1">
                  {dept.responsibilities.map((resp, index) => (
                    <li key={index} className="text-sm text-gray-600">{resp}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Regions Tab */}
      {activeTab === 'regions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.regions.map(region => (
            <Card key={region.id} className="p-4">
              <h3 className="font-semibold">{region.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Head: {region.head}</p>
              <p className="text-sm text-gray-500">Office: {region.office}</p>
              <Button variant="ghost" size="sm" className="mt-3 w-full">
                View Region Details
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Officials Tab */}
      {activeTab === 'officials' && (
        <div className="space-y-4">
          {profile.officials.map(official => (
            <Card key={official.id} className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar
                  src={official.avatar}
                  name={official.name}
                  size="md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{official.name}</h3>
                  <p className="text-sm text-gray-600">{official.position}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-3 h-3 mr-1" />
                      {official.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-3 h-3 mr-1" />
                      {official.phone}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={profile.preferences.language}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, language: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="sn">Shona</option>
                  <option value="nd">Ndebele</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <select
                  value={profile.preferences.timezone}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, timezone: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Africa/Harare">Africa/Harare (GMT+2)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Format</label>
                <select
                  value={profile.preferences.dateFormat}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, dateFormat: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                  <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                  <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Theme</label>
                <select
                  value={profile.preferences.theme}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, theme: e.target.value as any }
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Notification Preferences</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span>Email Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, email: e.target.checked }
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 text-gray-500 mr-2" />
                    <span>SMS Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications.sms}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, sms: e.target.checked }
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 text-gray-500 mr-2" />
                    <span>Push Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications.push}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, push: e.target.checked }
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 text-gray-500 mr-2" />
                    <span>Critical Alerts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications.alerts}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        notifications: { ...profile.preferences.notifications, alerts: e.target.checked }
                      }
                    })}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
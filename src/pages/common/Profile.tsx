// src/pages/common/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Calendar,
  Camera, Save, Edit2, Lock, Bell,
  Moon, Sun, Globe, Clock,
  BookOpen, Users
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { userAPI } from '../../api/user.api';
import { profileAPI } from '../../api/profile.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: {
    city?: string;
    country?: string;
    timezone?: string;
  };
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  role: string;
  roleDetails?: {
    student?: {
      grade?: string;
      school?: string;
      studentId?: string;
    };
    teacher?: {
      subjects?: string[];
      department?: string;
      employeeId?: string;
    };
    parent?: {
      children?: Array<{ id: string; name: string }>;
    };
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      inApp: boolean;
    };
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      showProfile: 'public' | 'contacts' | 'private';
    };
  };
  stats: {
    memberSince: Date;
    lastActive: Date;
    loginCount: number;
    achievements?: number;
    completedCourses?: number;
  };
}

// Define the type for update data that matches the API expectation
interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  location?: {
    city?: string;
    country?: string;
    timezone?: string;
  };
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  preferences?: {
    language?: string;
    theme?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      inApp?: boolean;
    };
    privacy?: {
      showEmail?: boolean;
      showPhone?: boolean;
      showProfile?: string;
    };
  };
}

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
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
      // Prepare update data that matches the API expectations
      const updateData: UpdateProfileData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().split('T')[0] : undefined,
        gender: profile.gender,
        bio: profile.bio,
        location: profile.location ? {
          city: profile.location.city,
          country: profile.location.country,
          timezone: profile.location.timezone,
        } : undefined,
        social: profile.social ? {
          twitter: profile.social.twitter,
          linkedin: profile.social.linkedin,
          facebook: profile.social.facebook,
        } : undefined,
        preferences: {
          language: profile.preferences.language,
          theme: profile.preferences.theme,
          timezone: profile.preferences.timezone,
          dateFormat: profile.preferences.dateFormat,
          timeFormat: profile.preferences.timeFormat,
          notifications: {
            email: profile.preferences.notifications.email,
            push: profile.preferences.notifications.push,
            sms: profile.preferences.notifications.sms,
            inApp: profile.preferences.notifications.inApp,
          },
          privacy: {
            showEmail: profile.preferences.privacy.showEmail,
            showPhone: profile.preferences.privacy.showPhone,
            showProfile: profile.preferences.privacy.showProfile,
          },
        },
      };
      
      const updated = await userAPI.updateProfile(updateData);
      // Refresh profile data after update
      await loadProfile();
      updateUser(updated.data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await profileAPI.uploadAvatar(formData);
      setProfile({ ...profile, avatar: response.data.url });
      updateUser({ ...user, avatar: response.data.url });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const formData = new FormData();
    formData.append('cover', file);

    try {
      const response = await profileAPI.uploadCover(formData);
      setProfile({ ...profile, coverImage: response.data.url });
      toast.success('Cover image updated successfully');
    } catch (error) {
      toast.error('Failed to upload cover image');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      toast.success('Password changed successfully');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
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

      {/* Cover Image */}
      <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-20 h-20 text-white opacity-50" />
          </div>
        )}
        
        {isEditing && (
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            <div className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Change Cover
            </div>
          </label>
        )}
      </div>

      {/* Profile Header */}
      <Card className="p-6 -mt-12 relative z-10">
        <div className="flex items-start">
          <div className="relative">
            <Avatar
              src={profile.avatar}
              name={`${profile.firstName} ${profile.lastName}`}
              size="xl"
              className="w-24 h-24 border-4 border-white shadow-lg"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="ml-6 flex-1">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 capitalize">{profile.role}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-1" />
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-1" />
                      {profile.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {format(profile.stats.memberSince, 'MMMM yyyy')}
                  </div>
                </div>
              </div>

              {/* Role-specific badges */}
              {profile.role === 'student' && profile.roleDetails?.student && (
                <div className="text-right">
                  <Badge className="bg-blue-100 text-blue-800">
                    Student ID: {profile.roleDetails.student.studentId}
                  </Badge>
                </div>
              )}
              {profile.role === 'teacher' && profile.roleDetails?.teacher && (
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800">
                    Employee ID: {profile.roleDetails.teacher.employeeId}
                  </Badge>
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 text-gray-700">{profile.bio}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-semibold">{format(profile.stats.memberSince, 'MMM d, yyyy')}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last Active</p>
              <p className="font-semibold">{format(profile.stats.lastActive, 'MMM d, yyyy')}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Logins</p>
              <p className="font-semibold">{profile.stats.loginCount}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        {profile.role === 'student' && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Courses Completed</p>
                <p className="font-semibold">{profile.stats.completedCourses || 0}</p>
              </div>
              <BookOpen className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
        )}
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['profile', 'preferences', 'notifications', 'privacy', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'profile' ? 'Profile Information' :
               tab === 'preferences' ? 'Preferences' :
               tab === 'notifications' ? 'Notifications' :
               tab === 'privacy' ? 'Privacy & Security' : 'Activity Log'}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
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
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+263 123 456 789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <Input
                    type="date"
                    value={profile.dateOfBirth ? format(profile.dateOfBirth, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value ? new Date(e.target.value) : undefined })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    value={profile.gender || ''}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Location & Bio</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={profile.location?.city || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, city: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <Input
                    value={profile.location?.country || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, country: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <h3 className="font-semibold mt-6 mb-4">Social Links</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Twitter URL"
                  value={profile.social?.twitter || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    social: { ...profile.social, twitter: e.target.value }
                  })}
                  disabled={!isEditing}
                  icon={<Globe className="w-4 h-4" />}
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={profile.social?.linkedin || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    social: { ...profile.social, linkedin: e.target.value }
                  })}
                  disabled={!isEditing}
                  icon={<Globe className="w-4 h-4" />}
                />
                <Input
                  placeholder="Facebook URL"
                  value={profile.social?.facebook || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    social: { ...profile.social, facebook: e.target.value }
                  })}
                  disabled={!isEditing}
                  icon={<Globe className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Display Settings</h3>
              <div className="space-y-4">
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
                    <option value="fr">French</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={profile.preferences.theme === 'light'}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, theme: e.target.value as any }
                        })}
                        disabled={!isEditing}
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
                        checked={profile.preferences.theme === 'dark'}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, theme: e.target.value as any }
                        })}
                        disabled={!isEditing}
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
                        checked={profile.preferences.theme === 'system'}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, theme: e.target.value as any }
                        })}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      <Clock className="w-4 h-4 mr-1" />
                      System
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Regional Settings</h3>
              <div className="space-y-4">
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
                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                    <option value="Europe/London">Europe/London (GMT+0/1)</option>
                    <option value="America/New_York">America/New York (GMT-4/5)</option>
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
                    <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                    <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                    <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Time Format</label>
                  <select
                    value={profile.preferences.timeFormat}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, timeFormat: e.target.value as any }
                    })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="12h">12-hour (12:00 PM)</option>
                    <option value="24h">24-hour (13:00)</option>
                  </select>
                </div>
              </div>
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
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
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
                  <p className="text-sm text-gray-500">Browser and mobile alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
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
                  <p className="text-sm text-gray-500">Text message alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
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
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-gray-500">Notifications within the platform</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.preferences.notifications.inApp}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      notifications: { ...profile.preferences.notifications, inApp: e.target.checked }
                    }
                  })}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Privacy & Security Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                <select
                  value={profile.preferences.privacy.showProfile}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      privacy: { ...profile.preferences.privacy, showProfile: e.target.value as any }
                    }
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="contacts">Contacts Only</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Show Email Address</p>
                  <p className="text-sm text-gray-500">Allow others to see your email</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.preferences.privacy.showEmail}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      privacy: { ...profile.preferences.privacy, showEmail: e.target.checked }
                    }
                  })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Show Phone Number</p>
                  <p className="text-sm text-gray-500">Allow others to see your phone</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.preferences.privacy.showPhone}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      privacy: { ...profile.preferences.privacy, showPhone: e.target.checked }
                    }
                  })}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Security</h3>
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>

            {showChangePassword && (
              <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Change Password</h4>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleChangePassword}>
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Setup 2FA</Button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Active Sessions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on Windows • Last active now</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-3" />
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-gray-500">iPhone 13 • Last active 2 days ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Revoke</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === 'activity' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Profile Updated</p>
                <p className="text-sm text-gray-500">Changed profile picture</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Lock className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Login</p>
                <p className="text-sm text-gray-500">Logged in from Chrome on Windows</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday at 09:45</p>
              </div>
            </div>

            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Bell className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Notification Settings Updated</p>
                <p className="text-sm text-gray-500">Changed email notification preferences</p>
                <p className="text-xs text-gray-400 mt-1">3 days ago</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View Full Activity Log
          </Button>
        </Card>
      )}
    </div>
  );
};
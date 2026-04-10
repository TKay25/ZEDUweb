import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import toast from 'react-hot-toast';
import axios from 'axios';

// Simple Tabs component
const Tabs: React.FC<{
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab: string;
}> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
      <div className="mt-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

interface TutorProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  specialization: string[];
  qualifications: string[];
  experience: number;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  totalHours: number;
  avatar?: string;
  joinDate: string;
}

const TutorProfile: React.FC = () => {
  const [profile, setProfile] = useState<TutorProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<TutorProfileData>>({});
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try to fetch from API, fall back to mock data
      try {
        const response = await axios.get(`${API_BASE_URL}/tutor/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (apiError) {
        console.log('Using mock data for profile');
        // Mock data for now
        setProfile({
          id: '1',
          name: 'Dr. John Moyo',
          email: 'john.moyo@zedu.co.zw',
          phone: '+263 77 123 4567',
          address: '123 Education Lane, Harare, Zimbabwe',
          bio: 'Experienced mathematics educator with over 10 years of teaching experience. Passionate about making mathematics accessible and enjoyable for all students.',
          specialization: ['Mathematics', 'Physics', 'Further Mathematics'],
          qualifications: ['PhD in Mathematics Education', 'MSc in Applied Mathematics', 'BEd in Mathematics'],
          experience: 10,
          rating: 4.8,
          totalStudents: 1250,
          totalCourses: 8,
          totalHours: 2450,
          joinDate: '2020-01-15'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData(profile || {});
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/tutor/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({ ...prev, ...formData } as TutorProfileData));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleInputChange = (field: keyof TutorProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Courses</p>
                  <p className="text-2xl font-semibold">{profile.totalCourses}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-2xl font-semibold">{profile.totalStudents.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Hours Taught</p>
                  <p className="text-2xl font-semibold">{profile.totalHours.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-2xl font-semibold">{profile.rating}/5.0</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Bio */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                value={formData.bio || profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
              />
            ) : (
              <p className="text-gray-600">{profile.bio}</p>
            )}
          </Card>

          {/* Specialization & Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specialization</h3>
              <div className="space-y-2">
                {profile.specialization.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Award className="w-4 h-4 mr-2 text-blue-500" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Qualifications</h3>
              <div className="space-y-2">
                {profile.qualifications.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Award className="w-4 h-4 mr-2 text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'personal',
      label: 'Personal Info',
      content: (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email || profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.email}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone || profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address || profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.address}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="text-gray-900">{new Date(profile.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tutor Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and professional details</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>Edit Profile</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <Avatar
            src={profile.avatar}
            alt={profile.name}
            size="lg"
          />
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={formData.name || profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-2xl font-bold text-gray-900 w-full mb-2 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            )}
            <p className="text-gray-500 mt-1">{profile.specialization.join(' • ')}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(profile.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {profile.rating} ({profile.totalStudents} students)
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="overview" />
    </div>
  );
};

export default TutorProfile;
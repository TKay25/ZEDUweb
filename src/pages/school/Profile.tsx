// src/pages/school/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  Building2, Mail, Phone, Globe,
  Camera, Save, Edit2, Users,
  Download, Bell, Moon, Sun, Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import schoolAPI from '../../api/school.api';
import type { SchoolProfile as APISchoolProfile } from '../../api/school.api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

// UI-specific profile interface (separate from API)
interface UIProfile {
  id: string;
  name: string;
  registrationNumber?: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  website?: string;
  address: string;
  logo?: string;
  coverImage?: string;
  established?: Date;
  type?: string;
  ownership?: string;
  motto?: string;
  vision?: string;
  mission?: string;
  accreditation?: Array<{
    id: string;
    name: string;
    issuedBy: string;
    issuedDate: Date;
    expiryDate?: Date;
    documentUrl: string;
  }>;
  contactPerson?: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
  };
  stats?: {
    totalStudents: number;
    totalStaff: number;
    totalClasses: number;
    totalRevenue: number;
  };
  preferences?: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

// Mock data for demonstration
const mockProfile: UIProfile = {
  id: '1',
  name: 'Zimbabwe Education University',
  registrationNumber: 'ZEDU/2024/001',
  email: 'info@zedu.ac.zw',
  phone: '+263 242 123456',
  alternativePhone: '+263 242 123457',
  website: 'www.zedu.ac.zw',
  address: '123 Education Avenue, Harare, Zimbabwe',
  logo: '',
  coverImage: '',
  established: new Date(2000, 0, 1),
  type: 'combined',
  ownership: 'private',
  motto: 'Education for Excellence',
  vision: 'To be a leading institution in providing quality education',
  mission: 'To empower students with knowledge and skills for a better future',
  accreditation: [
    {
      id: '1',
      name: 'Higher Education Council Accreditation',
      issuedBy: 'Ministry of Higher Education',
      issuedDate: new Date(2020, 0, 1),
      expiryDate: new Date(2025, 0, 1),
      documentUrl: '/certificates/accreditation.pdf'
    }
  ],
  contactPerson: {
    name: 'Dr. John Smith',
    position: 'Registrar',
    email: 'registrar@zedu.ac.zw',
    phone: '+263 242 123458'
  },
  bankDetails: {
    bankName: 'Central Bank',
    accountName: 'Zimbabwe Education University',
    accountNumber: '1234567890',
    branch: 'Harare Main'
  },
  stats: {
    totalStudents: 1250,
    totalStaff: 85,
    totalClasses: 42,
    totalRevenue: 2500000
  },
  preferences: {
    language: 'en',
    timezone: 'Africa/Harare',
    dateFormat: 'dd/MM/yyyy',
    currency: 'USD',
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  }
};

export const SchoolProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UIProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // For form display, we'll split the address string into parts
  const [addressParts, setAddressParts] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(mockProfile);
      // Parse address string into parts for form display
      if (mockProfile.address) {
        const parts = mockProfile.address.split(',');
        setAddressParts({
          street: parts[0]?.trim() || '',
          city: parts[1]?.trim() || '',
          state: parts[2]?.trim() || '',
          postalCode: '',
          country: parts[3]?.trim() || ''
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      // Combine address parts into a single string for the API
      const fullAddress = `${addressParts.street}, ${addressParts.city}, ${addressParts.state}, ${addressParts.country}`.replace(/, ,/g, ',').replace(/,$/, '');
      
      const updateData: Partial<APISchoolProfile> = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
        address: fullAddress
      };
      await schoolAPI.updateProfile(updateData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 500));
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, logo: imageUrl });
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error(error);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 500));
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, coverImage: imageUrl });
      toast.success('Cover image updated successfully');
    } catch (error) {
      toast.error('Failed to upload cover image');
      console.error(error);
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
        <h1 className="text-2xl font-bold">School Profile</h1>
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
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="School cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-20 h-20 text-white opacity-50" />
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

      {/* Logo and Basic Info */}
      <Card className="p-6 -mt-12 relative z-10">
        <div className="flex items-start">
          <div className="relative">
            <Avatar
              src={profile.logo}
              name={profile.name}
              size="xl"
              className="w-24 h-24 border-4 border-white shadow-lg"
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

          <div className="ml-6 flex-1">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                {profile.registrationNumber && (
                  <p className="text-gray-600">Reg: {profile.registrationNumber}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  {profile.type && (
                    <Badge className="bg-blue-100 text-blue-800">{profile.type}</Badge>
                  )}
                  {profile.ownership && (
                    <Badge className="bg-green-100 text-green-800">{profile.ownership}</Badge>
                  )}
                </div>
              </div>
              {profile.established && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Established</p>
                  <p className="font-semibold">{format(profile.established, 'MMMM d, yyyy')}</p>
                </div>
              )}
            </div>

            {profile.motto && (
              <p className="text-primary-600 italic mt-2">"{profile.motto}"</p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      {profile.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{profile.stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-2xl font-bold">{profile.stats.totalStaff}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Classes</p>
                <p className="text-2xl font-bold">{profile.stats.totalClasses}</p>
              </div>
              <Building2 className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Annual Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${profile.stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Simple Tabs Implementation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'contact', label: 'Contact Information' },
            { id: 'accreditation', label: 'Accreditation' },
            { id: 'banking', label: 'Banking Details' },
            { id: 'preferences', label: 'Preferences' }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Card className="p-6">
          <div className="space-y-6">
            {profile.vision && (
              <div>
                <h3 className="font-semibold mb-2">Vision</h3>
                <p className="text-gray-700">{profile.vision}</p>
              </div>
            )}
            
            {profile.mission && (
              <div>
                <h3 className="font-semibold mb-2">Mission</h3>
                <p className="text-gray-700">{profile.mission}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {profile.contactPerson && (
                <div>
                  <h3 className="font-semibold mb-3">Contact Person</h3>
                  <p className="font-medium">{profile.contactPerson.name}</p>
                  <p className="text-sm text-gray-600">{profile.contactPerson.position}</p>
                  <p className="text-sm text-gray-600 mt-2">Email: {profile.contactPerson.email}</p>
                  <p className="text-sm text-gray-600">Phone: {profile.contactPerson.phone}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">School Details</h3>
                {profile.type && <p className="text-sm text-gray-600">Type: {profile.type}</p>}
                {profile.ownership && <p className="text-sm text-gray-600">Ownership: {profile.ownership}</p>}
                {profile.registrationNumber && <p className="text-sm text-gray-600">Registration: {profile.registrationNumber}</p>}
                {profile.established && <p className="text-sm text-gray-600">Established: {format(profile.established, 'MMMM d, yyyy')}</p>}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Contact Information Tab */}
      {activeTab === 'contact' && (
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Primary Contact</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                {profile.alternativePhone !== undefined && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Alternative Phone</label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <Input
                        value={profile.alternativePhone || ''}
                        onChange={(e) => setProfile({ ...profile, alternativePhone: e.target.value })}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Website</label>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <Input
                      value={profile.website || ''}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Address</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                  <Input
                    value={addressParts.street}
                    onChange={(e) => setAddressParts({ ...addressParts, street: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <Input
                      value={addressParts.city}
                      onChange={(e) => setAddressParts({ ...addressParts, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                    <Input
                      value={addressParts.state}
                      onChange={(e) => setAddressParts({ ...addressParts, state: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                    <Input
                      value={addressParts.postalCode}
                      onChange={(e) => setAddressParts({ ...addressParts, postalCode: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Country</label>
                    <Input
                      value={addressParts.country}
                      onChange={(e) => setAddressParts({ ...addressParts, country: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Accreditation Tab */}
      {activeTab === 'accreditation' && profile.accreditation && (
        <Card className="p-6">
          <div className="space-y-4">
            {profile.accreditation.map(acc => (
              <div key={acc.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{acc.name}</h4>
                    <p className="text-sm text-gray-600">Issued by: {acc.issuedBy}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span>Issued: {format(acc.issuedDate, 'MMM d, yyyy')}</span>
                      {acc.expiryDate && (
                        <span>Expires: {format(acc.expiryDate, 'MMM d, yyyy')}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(acc.documentUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Certificate
                  </Button>
                </div>
              </div>
            ))}

            {isEditing && (
              <Button variant="outline" className="w-full">
                Add Accreditation
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Banking Details Tab */}
      {activeTab === 'banking' && profile.bankDetails && (
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bank Name</label>
              <Input
                value={profile.bankDetails.bankName}
                onChange={(e) => setProfile({
                  ...profile,
                  bankDetails: { ...profile.bankDetails!, bankName: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Branch</label>
              <Input
                value={profile.bankDetails.branch}
                onChange={(e) => setProfile({
                  ...profile,
                  bankDetails: { ...profile.bankDetails!, branch: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Account Name</label>
              <Input
                value={profile.bankDetails.accountName}
                onChange={(e) => setProfile({
                  ...profile,
                  bankDetails: { ...profile.bankDetails!, accountName: e.target.value }
                })}
                disabled={!isEditing}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Account Number</label>
              <Input
                value={profile.bankDetails.accountNumber}
                onChange={(e) => setProfile({
                  ...profile,
                  bankDetails: { ...profile.bankDetails!, accountNumber: e.target.value }
                })}
                disabled={!isEditing}
                type="password"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && profile.preferences && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Language</label>
                <select
                  value={profile.preferences.language}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences!, language: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="sw">Swahili</option>
                  <option value="sn">Shona</option>
                  <option value="nd">Ndebele</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Timezone</label>
                <select
                  value={profile.preferences.timezone}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences!, timezone: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Africa/Harare">Africa/Harare (GMT+2)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                  <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Date Format</label>
                <select
                  value={profile.preferences.dateFormat}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences!, dateFormat: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                  <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                  <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Currency</label>
                <select
                  value={profile.preferences.currency}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences!, currency: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="ZWL">ZWL (Z$)</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Notification Preferences</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2">
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
                        ...profile.preferences!,
                        notifications: {
                          ...profile.preferences!.notifications,
                          email: e.target.checked
                        }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </label>

                <label className="flex items-center justify-between p-2">
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
                        ...profile.preferences!,
                        notifications: {
                          ...profile.preferences!.notifications,
                          sms: e.target.checked
                        }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </label>

                <label className="flex items-center justify-between p-2">
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
                        ...profile.preferences!,
                        notifications: {
                          ...profile.preferences!.notifications,
                          push: e.target.checked
                        }
                      }
                    })}
                    disabled={!isEditing}
                  />
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Theme</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={profile.preferences.theme === 'light'}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences!, theme: e.target.value as any }
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
                      preferences: { ...profile.preferences!, theme: e.target.value as any }
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
                      preferences: { ...profile.preferences!, theme: e.target.value as any }
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
        </Card>
      )}
    </div>
  );
};
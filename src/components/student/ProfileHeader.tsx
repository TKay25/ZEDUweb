// src/components/student/ProfileHeader.tsx
import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Calendar, 
  Award, BookOpen, Settings, 
  Camera, Edit2, Check, X, LogOut,
  Trophy, Target
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import ProgressBar from '../ui/ProgressBar';
import { toast } from 'react-hot-toast';

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  studentId: string;
  grade: string;
  class: string;
  stream?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bio?: string;
  enrollmentDate: Date;
  guardian?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  stats: {
    coursesCompleted: number;
    coursesInProgress: number;
    averageGrade: number;
    totalPoints: number;
    rank?: number;
    totalStudents?: number;
    attendanceRate: number;
    certificatesEarned: number;
  };
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: Date;
  }>;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

interface ProfileHeaderProps {
  profile: StudentProfile;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onUpdateProfile?: (data: Partial<StudentProfile>) => Promise<void>;
  onChangeAvatar?: (file: File) => Promise<void>;
  onLogout?: () => void;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile = true,
  onEditProfile,
  onUpdateProfile,
  onChangeAvatar,
  onLogout,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone || '',
    bio: profile.bio || '',
    address: profile.address || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [showFullStats, setShowFullStats] = useState(false);

  const getFullName = () => `${profile.firstName} ${profile.lastName}`;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onChangeAvatar) {
      setIsUploading(true);
      try {
        await onChangeAvatar(file);
        toast.success('Profile picture updated');
      } catch (error) {
        toast.error('Failed to update profile picture');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (onUpdateProfile) {
      try {
        await onUpdateProfile(editData);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      bio: profile.bio || '',
      address: profile.address || ''
    });
    setIsEditing(false);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Cover Image / Header Background */}
      <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-800">
        {/* Edit Cover Button (optional) */}
        {isOwnProfile && (
          <button
            className="absolute bottom-2 right-2 p-1 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
            title="Change cover"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar Section */}
        <div className="flex justify-between items-start">
          <div className="relative -mt-12">
            <div className="relative">
              <Avatar
                src={profile.avatar}
                name={getFullName()}
                size="xl"
                className="border-4 border-white shadow-lg"
              />
              {isOwnProfile && !isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-2">
            {isOwnProfile && (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveEdit}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
              </>
            )}
            {!isOwnProfile && onEditProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEditProfile}
              >
                <Settings className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="mt-4">
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getFullName()}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="primary" size="sm">
                  Student
                </Badge>
                <span className="text-sm text-gray-500">
                  ID: {profile.studentId}
                </span>
              </div>
              {profile.bio && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  {profile.bio}
                </p>
              )}
            </>
          )}
        </div>

        {/* Contact Info */}
        {!isEditing && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-2" />
              <span>{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{profile.address}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Enrolled: {new Date(profile.enrollmentDate).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Academic Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Grade/Class</p>
              <p className="text-sm font-semibold">
                {profile.grade} - {profile.class}
                {profile.stream && ` (${profile.stream})`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Average Grade</p>
              <p className={`text-sm font-semibold ${getGradeColor(profile.stats.averageGrade)}`}>
                {profile.stats.averageGrade}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Attendance</p>
              <p className="text-sm font-semibold text-blue-600">
                {profile.stats.attendanceRate}%
              </p>
            </div>
            {profile.stats.rank && (
              <div className="text-center">
                <p className="text-xs text-gray-500">Class Rank</p>
                <p className="text-sm font-semibold text-purple-600">
                  #{profile.stats.rank} / {profile.stats.totalStudents}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Learning Statistics
            </h3>
            <button
              onClick={() => setShowFullStats(!showFullStats)}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              {showFullStats ? 'Show Less' : 'View All'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600">In Progress</span>
              </div>
              <p className="text-xl font-bold text-blue-700">
                {profile.stats.coursesInProgress}
              </p>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <Trophy className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600">Completed</span>
              </div>
              <p className="text-xl font-bold text-green-700">
                {profile.stats.coursesCompleted}
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-600">Certificates</span>
              </div>
              <p className="text-xl font-bold text-purple-700">
                {profile.stats.certificatesEarned}
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <Target className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-600">Points</span>
              </div>
              <p className="text-xl font-bold text-yellow-700">
                {profile.stats.totalPoints.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">
                {profile.stats.coursesCompleted} / {profile.stats.coursesCompleted + profile.stats.coursesInProgress} courses
              </span>
            </div>
            <ProgressBar
              value={(profile.stats.coursesCompleted / (profile.stats.coursesCompleted + profile.stats.coursesInProgress)) * 100}
              color="blue"
              className="h-2"
            />
          </div>
        </div>

        {/* Expanded Stats */}
        {showFullStats && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fade-in">
            <h4 className="text-sm font-semibold mb-3">Detailed Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Points Earned</span>
                <span className="font-medium">{profile.stats.totalPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Grade</span>
                <span className={`font-medium ${getGradeColor(profile.stats.averageGrade)}`}>
                  {profile.stats.averageGrade}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attendance Rate</span>
                <span className="font-medium">{profile.stats.attendanceRate}%</span>
              </div>
              {profile.stats.rank && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Class Rank</span>
                  <span className="font-medium">
                    #{profile.stats.rank} out of {profile.stats.totalStudents} students
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Recent Achievements
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full"
                  title={achievement.description}
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    {achievement.title}
                  </span>
                </div>
              ))}
              {profile.achievements.length > 3 && (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <span className="text-xs text-gray-600">
                    +{profile.achievements.length - 3} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </Card>
  );
};

export default ProfileHeader;
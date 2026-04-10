// src/components/student/SchoolCard.tsx
import React from 'react';
import {
  Building, MapPin, Mail, Globe,
  Users, GraduationCap, BookOpen, Star,
  ChevronRight
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export interface School {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  type: 'primary' | 'secondary' | 'high' | 'combined' | 'vocational';
  ownership: 'government' | 'council' | 'mission' | 'private';
  gender: 'boys' | 'girls' | 'mixed';
  boarding: 'day' | 'boarding' | 'both';
  rating?: number;
  established?: number;
  motto?: string;
  facilities?: string[];
  statistics: {
    totalStudents: number;
    totalTeachers: number;
    studentTeacherRatio: number;
    passRate: number;
    graduationRate?: number;
  };
  accreditation: {
    status: 'accredited' | 'pending' | 'probation';
    registrationNumber: string;
  };
  location: {
    province: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contactPerson?: {
    name: string;
    title: string;
    phone: string;
    email: string;
  };
  programs?: string[];
  achievements?: string[];
}

interface SchoolCardProps {
  school: School;
  onViewDetails?: (schoolId: string) => void;
  onContact?: (schoolId: string) => void;
  onVisitWebsite?: (url: string) => void;
  variant?: 'grid' | 'list' | 'compact';
  className?: string;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  onViewDetails,
  onContact,
  onVisitWebsite,
  variant = 'grid',
  className = ''
}) => {
  const getSchoolTypeLabel = (type: string) => {
    switch (type) {
      case 'primary': return 'Primary School';
      case 'secondary': return 'Secondary School';
      case 'high': return 'High School';
      case 'combined': return 'Combined School';
      case 'vocational': return 'Vocational Centre';
      default: return type;
    }
  };

  const getOwnershipLabel = (ownership: string) => {
    switch (ownership) {
      case 'government': return 'Government';
      case 'council': return 'Council';
      case 'mission': return 'Mission';
      case 'private': return 'Private';
      default: return ownership;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 fill-current text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-3 h-3 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
      }
    }
    return stars;
  };

  if (variant === 'list') {
    return (
      <div
        className={`flex bg-white dark:bg-gray-800 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer ${className}`}
        onClick={() => onViewDetails?.(school.id)}
      >
        {/* Logo Section */}
        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-l-lg overflow-hidden">
          {school.logo ? (
            <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{school.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" size="sm">{getSchoolTypeLabel(school.type)}</Badge>
                <Badge variant="secondary" size="sm">{getOwnershipLabel(school.ownership)}</Badge>
                <Badge variant={school.accreditation.status === 'accredited' ? 'success' : 'warning'} size="sm">
                  {school.accreditation.status}
                </Badge>
              </div>
            </div>
            {school.rating && (
              <div className="flex items-center">
                <div className="flex mr-1">{renderStars(school.rating)}</div>
                <span className="text-sm font-medium">{school.rating}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {school.location.district}, {school.location.province}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {school.statistics.totalStudents.toLocaleString()} students
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              Pass Rate: {school.statistics.passRate}%
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Ratio: 1:{school.statistics.studentTeacherRatio}
            </div>
          </div>

          {school.motto && (
            <p className="mt-2 text-sm italic text-gray-500">"{school.motto}"</p>
          )}

          <div className="flex items-center space-x-3 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(school.id);
              }}
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            {school.website && onVisitWebsite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVisitWebsite(school.website!);
                }}
              >
                <Globe className="w-4 h-4 mr-1" />
                Website
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(school.id);
              }}
            >
              <Mail className="w-4 h-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${className}`}
        onClick={() => onViewDetails?.(school.id)}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {school.logo ? (
            <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{school.name}</h4>
          <p className="text-xs text-gray-500">{school.location.district}</p>
        </div>
        <Badge variant="secondary" size="sm">
          {school.statistics.passRate}%
        </Badge>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div
      className="cursor-pointer"
      onClick={() => onViewDetails?.(school.id)}
    >
      <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
        {/* Header with Logo */}
        <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-800">
          <div className="absolute -bottom-8 left-4">
            <div className="w-16 h-16 rounded-xl bg-white shadow-lg overflow-hidden flex items-center justify-center">
              {school.logo ? (
                <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
              ) : (
                <Building className="w-8 h-8 text-primary-600" />
              )}
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant={school.accreditation.status === 'accredited' ? 'success' : 'warning'}>
              {school.accreditation.status}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="pt-10 p-4">
          <h3 className="text-lg font-semibold mb-1">{school.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {school.location.district}, {school.location.province}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-blue-600">{school.statistics.passRate}%</p>
              <p className="text-xs text-gray-500">Pass Rate</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-green-600">{school.statistics.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-purple-600">1:{school.statistics.studentTeacherRatio}</p>
              <p className="text-xs text-gray-500">Ratio</p>
            </div>
          </div>

          {/* School Type Badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="secondary" size="sm">{getSchoolTypeLabel(school.type)}</Badge>
            <Badge variant="secondary" size="sm">{getOwnershipLabel(school.ownership)}</Badge>
            <Badge variant="secondary" size="sm">{school.gender}</Badge>
            <Badge variant="secondary" size="sm">{school.boarding}</Badge>
          </div>

          {/* Rating */}
          {school.rating && (
            <div className="flex items-center mb-3">
              <div className="flex mr-2">{renderStars(school.rating)}</div>
              <span className="text-sm font-medium">{school.rating}</span>
            </div>
          )}

          {/* Facilities Preview */}
          {school.facilities && school.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {school.facilities.slice(0, 3).map((facility, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {facility}
                </span>
              ))}
              {school.facilities.length > 3 && (
                <span className="text-xs text-gray-500">+{school.facilities.length - 3}</span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(school.id);
              }}
            >
              <Mail className="w-4 h-4 mr-1" />
              Contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(school.id);
              }}
            >
              Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SchoolCard;
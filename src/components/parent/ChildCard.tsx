import React, { useState } from 'react';
//import { Link } from 'react-router-dom';
import {
   GraduationCap, Calendar, 
   TrendingUp, TrendingDown, Minus,
  Eye, MessageCircle, Bell, MoreVertical,
  CheckCircle, AlertCircle, 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

interface Child {
  id: string;
  name: string;
  grade: string;
  school: string;
  avatar?: string;
  dateOfBirth: Date;
  studentId: string;
  overallProgress: number;
  attendance: {
    present: number;
    total: number;
    percentage: number;
    trend?: 'up' | 'down' | 'stable';
  };
  grades: {
    average: number;
    trend?: 'up' | 'down' | 'stable';
    subjects: Array<{
      name: string;
      score: number;
      grade: string;
    }>;
  };
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: Date;
    type: 'assignment' | 'exam' | 'meeting';
  }>;
  alerts?: Array<{
    id: string;
    type: 'warning' | 'info' | 'success';
    message: string;
  }>;
  status: 'active' | 'inactive' | 'suspended';
}

interface ChildCardProps {
  child: Child;
  onViewDetails: (childId: string) => void;
  onMessage: (childId: string) => void;
  onViewProgress: (childId: string) => void;
  onScheduleMeeting: (childId: string) => void;
  onViewAlerts?: (childId: string) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  onViewDetails,
  onMessage,
  onViewProgress,
  onScheduleMeeting,
  onViewAlerts: _onViewAlerts // Prefix with underscore to indicate intentionally unused
}) => {
  const [showMenu, setShowMenu] = useState(false);
  // Remove unused state variables
  // const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  // Helper function to view alerts if needed
  const handleViewAlerts = () => {
    if (_onViewAlerts) {
      _onViewAlerts(child.id);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header with Gradient */}
      <div className="relative h-24 bg-gradient-to-r from-primary-600 to-primary-800 p-4">
        <div className="absolute -bottom-8 left-4">
          <Avatar
            src={child.avatar}
            name={child.name}
            size="xl"
            className="border-4 border-white shadow-lg"
          />
        </div>
        
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Badge className={getStatusColor(child.status)}>
            {child.status}
          </Badge>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onViewDetails(child.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </button>
                  <button
                    onClick={() => {
                      onMessage(child.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                  <button
                    onClick={() => {
                      onScheduleMeeting(child.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </button>
                  {_onViewAlerts && child.alerts && child.alerts.length > 0 && (
                    <button
                      onClick={() => {
                        handleViewAlerts();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      View Alerts ({child.alerts.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 p-4">
        {/* Name and Basic Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{child.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <GraduationCap className="w-4 h-4 mr-1" />
            {child.grade} • {child.school}
          </div>
          <p className="text-xs text-gray-400 mt-1">ID: {child.studentId}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-sm font-semibold text-gray-700">
              {child.attendance.percentage}%
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              Attendance
              {getTrendIcon(child.attendance.trend)}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className={`text-sm font-semibold ${getGradeColor(child.grades.average)}`}>
              {child.grades.average}%
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              Average
              {getTrendIcon(child.grades.trend)}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-sm font-semibold text-gray-700">
              {child.overallProgress}%
            </div>
            <div className="text-xs text-gray-500">Progress</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{child.overallProgress}%</span>
          </div>
          <ProgressBar value={child.overallProgress} className="h-2" />
        </div>

        {/* Subject Grades Preview */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Recent Subjects</span>
            <button
              onClick={() => onViewProgress(child.id)}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {child.grades.subjects.slice(0, 3).map((subject, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{subject.name}</span>
                <span className={`font-medium ${getGradeColor(subject.score)}`}>
                  {subject.score}% ({subject.grade})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        {child.upcomingEvents.length > 0 && (
          <div className="mb-4">
            <span className="text-sm font-medium mb-2 block">Upcoming</span>
            <div className="space-y-2">
              {child.upcomingEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="flex items-center text-xs">
                  <Calendar className="w-3 h-3 text-gray-400 mr-2" />
                  <span className="text-gray-600">{event.title}</span>
                  <span className="ml-auto text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {child.alerts && child.alerts.length > 0 && (
          <div className="mb-4 space-y-2">
            {child.alerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center p-2 rounded-lg text-xs ${
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                  alert.type === 'info' ? 'bg-blue-50 text-blue-800' :
                  'bg-green-50 text-green-800'
                }`}
              >
                {getAlertIcon(alert.type)}
                <span className="ml-2 flex-1">{alert.message}</span>
              </div>
            ))}
            {child.alerts.length > 2 && (
              <button
                onClick={handleViewAlerts}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center justify-center w-full py-1"
              >
                <Bell className="w-3 h-3 mr-1" />
                View {child.alerts.length - 2} more alerts
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(child.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onMessage(child.id)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onScheduleMeeting(child.id)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Meet
          </Button>
        </div>
      </div>
    </Card>
  );
};
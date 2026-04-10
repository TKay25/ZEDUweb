import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, TrendingUp, Award, Calendar,
  Bell, MessageCircle, CreditCard,
  ChevronRight, Clock, BookOpen,
  Eye, DollarSign
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import parentAPI from '../../api/parent.api';
import type { DashboardStats, UpcomingMeeting, RecentPayment } from '../../api/parent.api';
import { format, formatDistanceToNow } from 'date-fns';

interface Child {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
  school: string;
  attendance: number;
  averageGrade: number;
  upcomingAssignments: number;
  unreadMessages: number;
  recentActivity: Array<{
    id: string;
    type: 'grade' | 'attendance' | 'assignment' | 'message';
    description: string;
    timestamp: Date;
  }>;
}

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<UpcomingMeeting[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [childrenRes, statsRes, meetingsRes, paymentsRes] = await Promise.all([
        parentAPI.getChildren(),
        parentAPI.getDashboardStats(),
        parentAPI.getUpcomingMeetings(),
        parentAPI.getRecentPayments(5)
      ]);

      // Transform children data to match the Child interface
      const transformedChildren: Child[] = childrenRes.map(child => ({
        id: child.id,
        name: `${child.firstName} ${child.lastName}`,
        grade: `Form ${child.grade}`,
        avatar: child.avatar,
        school: 'Zedu Academy',
        attendance: child.attendance,
        averageGrade: child.averageGrade,
        upcomingAssignments: 0, // This should come from a separate API call
        unreadMessages: 0, // This should come from a separate API call
        recentActivity: [] // This should come from a separate API call
      }));

      setChildren(transformedChildren);
      setStats(statsRes);
      setUpcomingMeetings(meetingsRes);
      setRecentPayments(paymentsRes);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your children's education
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/parent/communications')}
            className="relative"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
            {stats.unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {stats.unreadMessages}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/parent/alerts')}
            className="relative"
          >
            <Bell className="w-4 h-4 mr-2" />
            Alerts
            {stats.recentAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {stats.recentAlerts}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Children</p>
              <p className="text-2xl font-bold">{stats.totalChildren}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fees Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.paidFees.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Pending: ${stats.pendingFees.toLocaleString()}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Meetings</p>
              <p className="text-2xl font-bold">{stats.upcomingMeetings}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Fees</p>
              <p className="text-2xl font-bold">${stats.totalFees.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Avatar
                  src={child.avatar}
                  name={child.name}
                  size="lg"
                  className="mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{child.name}</h3>
                  <p className="text-sm text-gray-600">{child.grade} • {child.school}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {child.unreadMessages > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {child.unreadMessages} new
                  </Badge>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Attendance</div>
                <div className="text-lg font-semibold text-green-600">
                  {child.attendance}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Average</div>
                <div className="text-lg font-semibold text-blue-600">
                  {child.averageGrade}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Assignments</div>
                <div className="text-lg font-semibold text-orange-600">
                  {child.upcomingAssignments}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {child.recentActivity.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {child.recentActivity.slice(0, 2).map((activity) => (
                    <div key={activity.id} className="flex items-center text-sm">
                      {activity.type === 'grade' && <Award className="w-4 h-4 text-green-500 mr-2" />}
                      {activity.type === 'attendance' && <Calendar className="w-4 h-4 text-blue-500 mr-2" />}
                      {activity.type === 'assignment' && <BookOpen className="w-4 h-4 text-orange-500 mr-2" />}
                      {activity.type === 'message' && <MessageCircle className="w-4 h-4 text-purple-500 mr-2" />}
                      <span className="text-gray-600">{activity.description}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/parent/child-progress/${child.id}`)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/parent/child-grades/${child.id}`)}
              >
                <Award className="w-4 h-4 mr-2" />
                Grades
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/parent/child-attendance/${child.id}`)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Attendance
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/parent/children/${child.id}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/parent/meetings')}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-12 rounded-full ${
                      meeting.type === 'parent-teacher' ? 'bg-green-500' :
                      meeting.type === 'academic-review' ? 'bg-blue-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <h4 className="font-medium">{meeting.title}</h4>
                      <p className="text-sm text-gray-600">
                        {meeting.childName} with {meeting.teacherName}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(meeting.datetime), 'MMM d, yyyy')}
                        <Clock className="w-3 h-3 ml-2 mr-1" />
                        {format(new Date(meeting.datetime), 'h:mm a')} ({meeting.duration} min)
                      </div>
                    </div>
                  </div>
                  <Badge className={
                    meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {meeting.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming meetings scheduled
              </div>
            )}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Payments</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/parent/payments')}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.childName}</p>
                    <p className="text-sm text-gray-600">{payment.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(payment.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                    <Badge className={
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent payments
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
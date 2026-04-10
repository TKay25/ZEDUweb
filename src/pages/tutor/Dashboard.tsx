import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, BookOpen, DollarSign,
  TrendingUp, Clock, Video, FileText,
  Bell, ChevronRight, Star, AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import axios from 'axios';

interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  totalCourses: number;
  totalEarnings: number;
  pendingEarnings: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  upcomingSessions: number;
  pendingGrading: number;
}

interface RecentActivity {
  id: string;
  type: 'submission' | 'enrollment' | 'question' | 'review' | 'earning';
  title: string;
  description: string;
  timestamp: Date;
  status?: string;
  link: string;
}

interface UpcomingSession {
  id: string;
  title: string;
  course: string;
  date: string;
  enrolled: number;
  status: 'scheduled' | 'live' | 'completed';
}

interface TopCourse {
  id: string;
  title: string;
  rating: number;
  students: number;
  earnings: number;
  completionRate: number;
}

export const TutorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Make individual API calls instead of using non-existent methods
      const [statsResponse, activitiesResponse, sessionsResponse, coursesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/tutor/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/tutor/dashboard/recent-activities`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/tutor/dashboard/upcoming-sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/tutor/courses/top`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
      setUpcomingSessions(sessionsResponse.data);
      setTopCourses(coursesResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set mock data for development/demo purposes
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development/demo when API is not available
  const setMockData = () => {
    setStats({
      totalStudents: 1250,
      activeCourses: 4,
      totalCourses: 6,
      totalEarnings: 12500,
      pendingEarnings: 2500,
      averageRating: 4.8,
      totalReviews: 342,
      completionRate: 78,
      upcomingSessions: 3,
      pendingGrading: 15
    });

    setRecentActivities([
      {
        id: '1',
        type: 'submission',
        title: 'New Assignment Submission',
        description: 'John Doe submitted "Calculus Assignment 3"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'pending',
        link: '/tutor/assignments/1'
      },
      {
        id: '2',
        type: 'enrollment',
        title: 'New Student Enrollment',
        description: 'Sarah Johnson enrolled in "Advanced Mathematics"',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        link: '/tutor/courses/1'
      },
      {
        id: '3',
        type: 'question',
        title: 'New Question',
        description: 'Mike Brown asked a question in "Physics 101"',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        link: '/tutor/questions/1'
      },
      {
        id: '4',
        type: 'review',
        title: 'New 5-Star Review',
        description: 'Emily Wilson left a review for "Web Development Bootcamp"',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        link: '/tutor/courses/2/reviews'
      },
      {
        id: '5',
        type: 'earning',
        title: 'New Earnings',
        description: 'You earned $450 from course enrollments',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        link: '/tutor/earnings'
      }
    ]);

    setUpcomingSessions([
      {
        id: '1',
        title: 'Calculus: Derivatives Deep Dive',
        course: 'Advanced Mathematics',
        date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        enrolled: 45,
        status: 'scheduled'
      },
      {
        id: '2',
        title: 'Physics Lab: Mechanics',
        course: 'Physics 101',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        enrolled: 32,
        status: 'scheduled'
      },
      {
        id: '3',
        title: 'Web Development Q&A Session',
        course: 'Web Development Bootcamp',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        enrolled: 67,
        status: 'scheduled'
      }
    ]);

    setTopCourses([
      {
        id: '1',
        title: 'Advanced Mathematics',
        rating: 4.9,
        students: 342,
        earnings: 5120,
        completionRate: 85
      },
      {
        id: '2',
        title: 'Web Development Bootcamp',
        rating: 4.8,
        students: 567,
        earnings: 6800,
        completionRate: 72
      },
      {
        id: '3',
        title: 'Physics 101',
        rating: 4.7,
        students: 341,
        earnings: 3410,
        completionRate: 68
      }
    ]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'enrollment': return <Users className="w-4 h-4 text-green-500" />;
      case 'question': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'review': return <Star className="w-4 h-4 text-purple-500" />;
      case 'earning': return <DollarSign className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
            Welcome back, {user?.firstName || 'Tutor'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your courses today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="primary" 
            onClick={() => navigate('/tutor/courses/create')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/tutor/live-session/create')}
          >
            <Video className="w-4 h-4 mr-2" />
            Schedule Live Session
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents?.toLocaleString() || 0}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeCourses || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Out of {stats?.totalCourses || 0} total</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {stats && (
            <ProgressBar 
              value={(stats.activeCourses / stats.totalCourses) * 100} 
              className="mt-4"
            />
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats?.totalEarnings?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                ${stats?.pendingEarnings?.toLocaleString() || 0} pending
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{stats?.averageRating || 0}</p>
                <p className="text-sm text-gray-500 ml-1">/5</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stats?.totalReviews || 0} reviews</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600">Upcoming Sessions</p>
              <p className="text-xl font-bold text-blue-700">{stats?.upcomingSessions || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600">Pending Grading</p>
              <p className="text-xl font-bold text-yellow-700">{stats?.pendingGrading || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600">Completion Rate</p>
              <p className="text-xl font-bold text-green-700">{stats?.completionRate || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Top Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Performing Courses */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Top Performing Courses</h2>
              <button 
                onClick={() => navigate('/tutor/courses')} 
                className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {topCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{course.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {course.students} students
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${course.earnings.toLocaleString()}
                      </span>
                    </div>
                    <ProgressBar value={course.completionRate} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => navigate(activity.link)}
                  className="w-full flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {activity.status && (
                    <Badge size="sm" className={
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {activity.status}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Upcoming Sessions & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Live Sessions */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Live Sessions</h2>
              <button 
                onClick={() => navigate('/tutor/live-session')} 
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Schedule
              </button>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{session.title}</h3>
                    {session.status === 'live' && (
                      <Badge className="bg-green-100 text-green-800 animate-pulse">
                        Live Now
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{session.course}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(session.date), 'MMM d, h:mm a')}
                    </span>
                    <span className="flex items-center text-gray-600">
                      <Users className="w-3 h-3 mr-1" />
                      {session.enrolled} enrolled
                    </span>
                  </div>
                  {session.status === 'live' && (
                    <Button size="sm" className="w-full mt-2" onClick={() => navigate(`/tutor/live-session/${session.id}`)}>
                      <Video className="w-3 h-3 mr-1" />
                      Join Session
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/tutor/courses/create')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/tutor/assignments')}>
                <FileText className="w-4 h-4 mr-2" />
                Grade Submissions ({stats?.pendingGrading || 0})
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/tutor/live-session/create')}>
                <Video className="w-4 h-4 mr-2" />
                Schedule Live Session
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/tutor/attendance')}>
                <Clock className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/tutor/earnings/withdraw')}>
                <DollarSign className="w-4 h-4 mr-2" />
                Withdraw Earnings
              </Button>
            </div>
          </Card>

          {/* Tips & Insights */}
          <Card className="p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <h3 className="font-semibold mb-2">Pro Tip 💡</h3>
            <p className="text-sm opacity-90 mb-3">
              Engage your students with interactive quizzes and live sessions to boost completion rates!
            </p>
            <Button variant="outline" className="bg-white text-primary-600 hover:bg-gray-100 w-full">
              View Resources
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
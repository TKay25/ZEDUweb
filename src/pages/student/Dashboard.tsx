import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Award, TrendingUp,
  ChevronRight, Bell, Star,
  PlayCircle, FileText, HelpCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import Avatar from '../../components/ui/Avatar';
import Badge  from '../../components/ui/Badge';
//import CourseCard from '../../components/student/CourseCard';
//import AssignmentItem from '../../components/student/AssignmentItem';
import { ProgressChart } from '../../components/student/ProgressChart';
import { useAuth } from '../../hooks/useAuth';

// Define interfaces for all data structures
interface Instructor {
  name: string;
}

interface NextLesson {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  level: string;
  rating: number;
  enrolledStudents: number;
  category: string;
  nextLesson: NextLesson;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  points: number;
  status: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  time: Date;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
}

interface ScheduleItem {
  id: string;
  course: string;
  time: string;
  type: string;
}

interface DashboardStats {
  coursesInProgress: number;
  completedCourses: number;
  averageGrade: number;
  totalPoints: number;
  rank: number;
  totalStudents: number;
}

interface DashboardData {
  welcomeMessage: string;
  stats: DashboardStats;
  currentCourses: Course[];
  upcomingAssignments: Assignment[];
  recentActivity: Activity[];
  announcements: Announcement[];
  todaySchedule: ScheduleItem[];
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    welcomeMessage: '',
    stats: {
      coursesInProgress: 0,
      completedCourses: 0,
      averageGrade: 0,
      totalPoints: 0,
      rank: 0,
      totalStudents: 0
    },
    currentCourses: [],
    upcomingAssignments: [],
    recentActivity: [],
    announcements: [],
    todaySchedule: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      //

      setDashboardData({
        welcomeMessage: `Welcome back, ${user?.firstName || 'Student'}! Ready to continue your learning journey?`,
        stats: {
          coursesInProgress: 4,
          completedCourses: 12,
          averageGrade: 85,
          totalPoints: 2450,
          rank: 15,
          totalStudents: 234
        },
        currentCourses: [
          {
            id: '1',
            title: 'Advanced Mathematics',
            description: 'Calculus and Linear Algebra',
            instructor: { name: 'Dr. Sarah Johnson' },
            thumbnail: '/images/courses/math.jpg',
            progress: 65,
            totalLessons: 24,
            completedLessons: 16,
            duration: '8 weeks',
            level: 'Advanced',
            rating: 4.8,
            enrolledStudents: 156,
            category: 'Mathematics',
            nextLesson: { id: '17', title: 'Integration Techniques' }
          },
          {
            id: '2',
            title: 'Physics Fundamentals',
            description: 'Mechanics and Thermodynamics',
            instructor: { name: 'Prof. James Makoni' },
            thumbnail: '/images/courses/physics.jpg',
            progress: 32,
            totalLessons: 20,
            completedLessons: 6,
            duration: '6 weeks',
            level: 'Intermediate',
            rating: 4.6,
            enrolledStudents: 98,
            category: 'Science',
            nextLesson: { id: '7', title: "Newton's Laws" }
          }
        ],
        upcomingAssignments: [
          {
            id: '1',
            title: 'Calculus Problem Set',
            course: 'Advanced Mathematics',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            points: 100,
            status: 'pending'
          },
          {
            id: '2',
            title: 'Physics Lab Report',
            course: 'Physics Fundamentals',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            points: 50,
            status: 'pending'
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'assignment',
            description: 'Submitted Algebra Assignment',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: '2',
            type: 'course',
            description: 'Completed Lesson: Derivatives',
            time: new Date(Date.now() - 5 * 60 * 60 * 1000)
          },
          {
            id: '3',
            type: 'quiz',
            description: 'Scored 92% on Physics Quiz',
            time: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        ],
        announcements: [
          {
            id: '1',
            title: 'Mid-Term Exam Schedule',
            content: 'Mid-term exams will begin next week. Check your course pages for details.',
            date: new Date()
          },
          {
            id: '2',
            title: 'New Scholarship Opportunity',
            content: 'Apply for the ZEDU Excellence Scholarship by end of month.',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ],
        todaySchedule: [
          {
            id: '1',
            course: 'Advanced Mathematics',
            time: '09:00 - 10:30',
            type: 'lecture'
          },
          {
            id: '2',
            course: 'Physics Fundamentals',
            time: '11:00 - 12:30',
            type: 'lab'
          },
          {
            id: '3',
            course: 'Study Group',
            time: '14:00 - 15:30',
            type: 'group'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
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
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {dashboardData.welcomeMessage}
          </h1>
          <p className="text-gray-600 mt-1">
            Track your progress and continue where you left off
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Avatar
            src={user?.avatar}
            name={`${user?.firstName || ''} ${user?.lastName || ''}`}
            size="md"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Courses in Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData.stats.coursesInProgress}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData.stats.completedCourses}
              </p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Grade</p>
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData.stats.averageGrade}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Points</p>
              <p className="text-2xl font-bold text-yellow-600">
                {dashboardData.stats.totalPoints}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Class Rank</p>
              <p className="text-2xl font-bold text-primary-600">
                #{dashboardData.stats.rank}
              </p>
            </div>
            <span className="text-sm text-gray-500">
              of {dashboardData.stats.totalStudents}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Courses & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Courses */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Current Courses</h2>
              <Link
                to="/student/courses"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.currentCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/student/courses/${course.id}`}
                      className="font-medium hover:text-primary-600"
                    >
                      {course.title}
                    </Link>
                    <p className="text-sm text-gray-500">{course.instructor.name}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <ProgressBar value={course.progress} className="h-2" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
            <ProgressChart
              data={{
                weeklyProgress: [
                  { week: 'Week 1', completed: 5, timeSpent: 4.5, score: 85 },
                  { week: 'Week 2', completed: 7, timeSpent: 6.2, score: 88 },
                  { week: 'Week 3', completed: 4, timeSpent: 3.8, score: 82 },
                  { week: 'Week 4', completed: 8, timeSpent: 7.5, score: 91 }
                ]
              }}
              type="weekly"
            />
          </Card>
        </div>

        {/* Right Column - Activities & Announcements */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {dashboardData.todaySchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'lecture' ? 'bg-blue-500' :
                      item.type === 'lab' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{item.course}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Assignments</h2>
            <div className="space-y-3">
              {dashboardData.upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{assignment.title}</p>
                    <p className="text-xs text-gray-500">{assignment.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Due in {Math.ceil((assignment.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/student/assignments"
              className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              View All Assignments
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  {activity.type === 'assignment' && <FileText className="w-4 h-4 text-blue-500 mt-0.5" />}
                  {activity.type === 'course' && <BookOpen className="w-4 h-4 text-green-500 mt-0.5" />}
                  {activity.type === 'quiz' && <HelpCircle className="w-4 h-4 text-purple-500 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcements */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Announcements</h2>
            <div className="space-y-3">
              {dashboardData.announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary-500 pl-3">
                  <p className="font-medium text-sm">{announcement.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
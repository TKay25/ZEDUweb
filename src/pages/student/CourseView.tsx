import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PlayCircle, FileText,
  Clock, Users, Star, ChevronLeft,
  Download, Share2, Bookmark, CheckCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

// Define interfaces
interface Instructor {
  name: string;
  avatar: string;
  title: string;
  bio: string;
  rating: number;
  students: number;
  courses: number;
}

interface SyllabusItem {
  week: number;
  title: string;
  topics: string[];
  duration: string;
  completed: boolean;
}

interface Material {
  name: string;
  type: string;
  size: string;
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
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
  lastUpdated: string;
  language: string;
  objectives: string[];
  prerequisites: string[];
  syllabus: SyllabusItem[];
  materials: Material[];
  reviews: Review[];
}

export const CourseView: React.FC = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCourse({
        id: courseId || '1',
        title: 'Advanced Mathematics',
        description: 'Master calculus, linear algebra, and differential equations with this comprehensive course designed for advanced students.',
        instructor: {
          name: 'Dr. Tinashe Dure',
          avatar: '/avatars/sarah.jpg',
          title: 'Professor of Mathematics',
          bio: 'PhD in Applied Mathematics from Cambridge University with 15 years of teaching experience.',
          rating: 4.9,
          students: 1234,
          courses: 8
        },
        thumbnail: '/images/courses/math.jpg',
        progress: 65,
        totalLessons: 24,
        completedLessons: 16,
        duration: '8 weeks',
        level: 'Advanced',
        rating: 4.8,
        enrolledStudents: 156,
        category: 'Mathematics',
        lastUpdated: '2024-01-15',
        language: 'English',
        objectives: [
          'Understand fundamental concepts of calculus',
          'Solve complex differential equations',
          'Apply linear algebra to real-world problems',
          'Master integration techniques',
          'Analyze mathematical models'
        ],
        prerequisites: [
          'Basic algebra knowledge',
          'Understanding of trigonometry',
          'Completion of High School Mathematics'
        ],
        syllabus: [
          {
            week: 1,
            title: 'Limits and Continuity',
            topics: ['Introduction to Limits', 'Limit Laws', 'Continuity', 'Infinite Limits'],
            duration: '3 hours',
            completed: true
          },
          {
            week: 2,
            title: 'Derivatives',
            topics: ['Definition of Derivative', 'Differentiation Rules', 'Chain Rule', 'Implicit Differentiation'],
            duration: '4 hours',
            completed: true
          },
          {
            week: 3,
            title: 'Applications of Derivatives',
            topics: ['Related Rates', 'Optimization', 'Curve Sketching', 'L\'Hospital\'s Rule'],
            duration: '4 hours',
            completed: false
          },
          {
            week: 4,
            title: 'Integrals',
            topics: ['Antiderivatives', 'Definite Integrals', 'Fundamental Theorem', 'Substitution Rule'],
            duration: '4 hours',
            completed: false
          }
        ],
        materials: [
          { name: 'Course Textbook PDF', type: 'pdf', size: '15 MB' },
          { name: 'Practice Problems Set 1', type: 'doc', size: '2 MB' },
          { name: 'Formula Sheet', type: 'pdf', size: '1 MB' }
        ],
        reviews: [
          {
            id: 1,
            user: 'John M.',
            avatar: '/avatars/john.jpg',
            rating: 5,
            comment: 'Excellent course! Dr. Johnson explains complex concepts very clearly.',
            date: '2024-01-10'
          },
          {
            id: 2,
            user: 'Sarah T.',
            avatar: '/avatars/sarah.jpg',
            rating: 4,
            comment: 'Very comprehensive. The practice problems are really helpful.',
            date: '2024-01-05'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        to="/student/courses"
        className="inline-flex items-center text-gray-600 hover:text-primary-600"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Courses
      </Link>

      {/* Hero Section */}
      <div className="relative h-64 rounded-xl overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Badge className="bg-primary-600 text-white">{course.level}</Badge>
            <Badge className="bg-white/20 text-white">{course.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {course.enrolledStudents} students
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              {course.rating}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {course.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Your Progress</span>
          <span className="text-primary-600 font-bold">{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} className="h-3" />
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
          <Button size="sm" variant="primary">
            <PlayCircle className="w-4 h-4 mr-2" />
            Continue Learning
          </Button>
        </div>
      </Card>

      {/* Custom Tabs using buttons */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'syllabus', label: 'Syllabus' },
            { id: 'materials', label: 'Materials' },
            { id: 'reviews', label: 'Reviews' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
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
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">About This Course</h2>
              <p className="text-gray-700">{course.description}</p>
            </Card>

            {/* Learning Objectives */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">What You'll Learn</h2>
              <ul className="grid grid-cols-2 gap-3">
                {course.objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Prerequisites */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Prerequisites</h2>
              <ul className="space-y-2">
                {course.prerequisites.map((prereq: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2" />
                    <span className="text-gray-700">{prereq}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Instructor Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Instructor</h2>
              <div className="flex items-center space-x-3 mb-3">
                <Avatar src={course.instructor.avatar} name={course.instructor.name} size="lg" />
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-gray-500">{course.instructor.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{course.instructor.bio}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Rating</span>
                  <p className="font-medium flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    {course.instructor.rating}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Students</span>
                  <p className="font-medium">{course.instructor.students}</p>
                </div>
              </div>
            </Card>

            {/* Course Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Course Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium">{course.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Language</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Lessons</span>
                  <span className="font-medium">{course.totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Certificate</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save for Later
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Course
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Syllabus
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Syllabus Tab */}
      {activeTab === 'syllabus' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Course Syllabus</h2>
          <div className="space-y-4">
            {course.syllabus.map((week: SyllabusItem) => (
              <div key={week.week} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-primary-600">Week {week.week}</span>
                    <span className="font-medium">{week.title}</span>
                    {week.completed && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{week.duration}</span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {week.topics.map((topic: string, index: number) => (
                      <li key={index} className="flex items-center text-sm">
                        <PlayCircle className="w-4 h-4 text-gray-400 mr-2" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  {!week.completed && (
                    <Button size="sm" className="mt-3">
                      Start Week {week.week}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Course Materials</h2>
          <div className="space-y-3">
            {course.materials.map((material: Material, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{material.name}</p>
                    <p className="text-xs text-gray-500">{material.type.toUpperCase()} • {material.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Student Reviews</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-yellow-600">{course.rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(course.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500">({course.reviews.length} reviews)</span>
            </div>
          </div>

          <div className="space-y-4">
            {course.reviews.map((review: Review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar src={review.avatar} name={review.user} size="sm" />
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm ml-12">{review.comment}</p>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-6">
            Write a Review
          </Button>
        </Card>
      )}
    </div>
  );
};
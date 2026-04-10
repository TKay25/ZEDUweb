import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Grid3x3, List,
  BookOpen, Clock,
  Users, Star, TrendingUp
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import CourseCard from '../../components/student/CourseCard';
import { FilterBar } from '../../components/forms/FilterBar';

// Updated Course interface to exactly match the expected type from CourseCard
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';  // Changed to union type
  rating: number;
  enrolledStudents: number;
  category: string;
  nextLesson: {
    id: string;
    title: string;
  };
  tags?: string[];
  prerequisites?: string[];
  objectives?: string[];
}

export const Courses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    rating: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Advanced Mathematics',
      description: 'Master calculus, linear algebra, and differential equations',
      instructor: { 
        id: 'inst1',
        name: 'Dr. Sarah Johnson', 
        avatar: '/avatars/sarah.jpg' 
      },
      thumbnail: '/images/courses/math.jpg',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      duration: '8 weeks',
      level: 'advanced',  // Changed from 'Advanced' to 'advanced'
      rating: 4.8,
      enrolledStudents: 156,
      category: 'Mathematics',
      nextLesson: { id: '17', title: 'Integration Techniques' }
    },
    {
      id: '2',
      title: 'Physics Fundamentals',
      description: 'Explore mechanics, thermodynamics, and waves',
      instructor: { 
        id: 'inst2',
        name: 'Prof. James Makoni', 
        avatar: '/avatars/james.jpg' 
      },
      thumbnail: '/images/courses/physics.jpg',
      progress: 32,
      totalLessons: 20,
      completedLessons: 6,
      duration: '6 weeks',
      level: 'intermediate',  // Changed from 'Intermediate' to 'intermediate'
      rating: 4.6,
      enrolledStudents: 98,
      category: 'Science',
      nextLesson: { id: '7', title: 'Newton\'s Laws' }
    },
    {
      id: '3',
      title: 'English Literature',
      description: 'Study classic and contemporary literature',
      instructor: { 
        id: 'inst3',
        name: 'Dr. Elizabeth Dube', 
        avatar: '/avatars/elizabeth.jpg' 
      },
      thumbnail: '/images/courses/english.jpg',
      progress: 0,
      totalLessons: 18,
      completedLessons: 0,
      duration: '8 weeks',
      level: 'beginner',  // Changed from 'Beginner' to 'beginner'
      rating: 4.7,
      enrolledStudents: 112,
      category: 'Languages',
      nextLesson: { id: '1', title: 'Introduction to Poetry' }
    },
    {
      id: '4',
      title: 'Chemistry Essentials',
      description: 'Learn atomic structure, bonding, and reactions',
      instructor: { 
        id: 'inst4',
        name: 'Dr. Tafadzwa Moyo', 
        avatar: '/avatars/tafadzwa.jpg' 
      },
      thumbnail: '/images/courses/chemistry.jpg',
      progress: 45,
      totalLessons: 22,
      completedLessons: 10,
      duration: '8 weeks',
      level: 'intermediate',  // Changed from 'Intermediate' to 'intermediate'
      rating: 4.5,
      enrolledStudents: 87,
      category: 'Science',
      nextLesson: { id: '11', title: 'Chemical Bonding' }
    },
    {
      id: '5',
      title: 'Computer Science 101',
      description: 'Introduction to programming and algorithms',
      instructor: { 
        id: 'inst5',
        name: 'Eng. Michael Sibanda', 
        avatar: '/avatars/michael.jpg' 
      },
      thumbnail: '/images/courses/cs.jpg',
      progress: 78,
      totalLessons: 30,
      completedLessons: 23,
      duration: '10 weeks',
      level: 'beginner',  // Changed from 'Beginner' to 'beginner'
      rating: 4.9,
      enrolledStudents: 203,
      category: 'Technology',
      nextLesson: { id: '24', title: 'Data Structures' }
    },
    {
      id: '6',
      title: 'History of Zimbabwe',
      description: 'From pre-colonial times to modern day',
      instructor: { 
        id: 'inst6',
        name: 'Prof. Chengetai Ncube', 
        avatar: '/avatars/chengetai.jpg' 
      },
      thumbnail: '/images/courses/history.jpg',
      progress: 15,
      totalLessons: 16,
      completedLessons: 2,
      duration: '6 weeks',
      level: 'beginner',  // Changed from 'Beginner' to 'beginner'
      rating: 4.7,
      enrolledStudents: 67,
      category: 'Humanities',
      nextLesson: { id: '3', title: 'Great Zimbabwe Kingdom' }
    }
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [filters, searchTerm, sortBy, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...courses];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(c => 
        c.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Apply level filter
    if (filters.level) {
      filtered = filtered.filter(c => 
        c.level === filters.level.toLowerCase()
      );
    }
    
    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(c => 
        c.rating >= parseFloat(filters.rating)
      );
    }
    
    // Apply sorting
    filtered = applySorting(filtered);
    
    setFilteredCourses(filtered);
  };

  const applySorting = (coursesToSort: Course[]) => {
    switch (sortBy) {
      case 'popular':
        return [...coursesToSort].sort((a, b) => b.enrolledStudents - a.enrolledStudents);
      case 'rating':
        return [...coursesToSort].sort((a, b) => b.rating - a.rating);
      case 'title':
        return [...coursesToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'progress':
        return [...coursesToSort].sort((a, b) => b.progress - a.progress);
      default:
        return coursesToSort;
    }
  };

  const filterOptions = [
    {
      id: 'category',
      label: 'Category',
      type: 'select' as const,
      options: [
        { value: 'mathematics', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        { value: 'languages', label: 'Languages' },
        { value: 'humanities', label: 'Humanities' },
        { value: 'technology', label: 'Technology' }
      ]
    },
    {
      id: 'level',
      label: 'Level',
      type: 'select' as const,
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ]
    },
    {
      id: 'rating',
      label: 'Minimum Rating',
      type: 'select' as const,
      options: [
        { value: '4', label: '4+ stars' },
        { value: '4.5', label: '4.5+ stars' },
        { value: '4.8', label: '4.8+ stars' }
      ]
    }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'progress', label: 'Progress' }
  ];

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleContinueCourse = (courseId: string) => {
    // Navigate to course view
    window.location.href = `/student/courses/${courseId}`;
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and continue learning
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-5 h-5" />}
          className="w-full"
        />
        
        <FilterBar
          filters={filterOptions}
          values={filters}
          onChange={handleFilterChange}
          resultCount={filteredCourses.length}
          totalCount={courses.length}
        />
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Enrolled</p>
              <p className="text-2xl font-bold text-blue-600">
                {courses.length}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-green-600">
                {courses.filter(c => c.progress > 0 && c.progress < 100).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-purple-600">
                {courses.filter(c => c.progress === 100).length}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Not Started</p>
              <p className="text-2xl font-bold text-yellow-600">
                {courses.filter(c => c.progress === 0).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Courses Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onContinue={handleContinueCourse}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <Link
                    to={`/student/courses/${course.id}`}
                    className="text-lg font-semibold hover:text-primary-600"
                  >
                    {course.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      {course.enrolledStudents} students
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {course.rating}
                    </span>
                    <Badge variant="secondary" size="sm">
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium mb-2">
                    Progress: {course.progress}%
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleContinueCourse(course.id)}
                  >
                    {course.progress === 0 ? 'Start' : 'Continue'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Courses Found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </Card>
      )}
    </div>
  );
};
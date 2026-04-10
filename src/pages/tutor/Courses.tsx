import React, { useState, useEffect } from 'react';
import {
  Grid, List, Plus,
  Edit, Trash2, Copy, Eye, MoreVertical,
  Users, DollarSign, Star, Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  students: number;
  rating: number;
  reviews: number;
  earnings: number;
  status: 'draft' | 'published' | 'archived';
  lastUpdated: Date;
  progress?: number;
}

// Simple Select component
const Select: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  children: React.ReactNode;
}> = ({ value, onChange, className, children }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
    >
      {children}
    </select>
  );
};

export const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/tutor/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(courses.filter(c => c.id !== courseId));
        toast.success('Course deleted successfully');
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  const handleDuplicateCourse = async (course: Course) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/tutor/courses/${course.id}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course duplicated successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to duplicate course');
    }
  };

  const handleStatusChange = async (courseId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/tutor/courses/${courseId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(courses.map(c => 
        c.id === courseId ? { ...c, status: status as any } : c
      ));
      toast.success(`Course ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage and track your courses</p>
        </div>
        <Button onClick={() => navigate('/tutor/courses/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Courses</p>
          <p className="text-2xl font-bold">{courses.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold">{courses.filter(c => c.status === 'published').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.students, 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold">
            ${courses.reduce((sum, c) => sum + c.earnings, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-40"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </Select>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-40"
          >
            <option value="all">All Categories</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="languages">Languages</option>
            <option value="technology">Technology</option>
          </Select>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No courses found</p>
          <Button onClick={() => navigate('/tutor/courses/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Course
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{course.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center space-x-2 mb-3">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <Badge variant="secondary">
                    {course.category}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div className="text-center">
                    <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span>{course.students}</span>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span>${course.price}</span>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span>{course.progress || 0}%</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/tutor/courses/${course.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/tutor/courses/${course.id}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <div className="relative group">
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleDuplicateCourse(course)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                        {course.status === 'published' ? (
                          <button
                            onClick={() => handleStatusChange(course.id, 'draft')}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(course.id, 'published')}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded object-cover mr-3" />
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <Badge className={getLevelColor(course.level)} size="sm">
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{course.category}</td>
                    <td className="px-6 py-4">{course.students}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{course.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({course.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">${course.price}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/tutor/courses/${course.id}`)}
                          className="text-gray-400 hover:text-primary-600"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/tutor/courses/${course.id}/edit`)}
                          className="text-gray-400 hover:text-primary-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Courses;
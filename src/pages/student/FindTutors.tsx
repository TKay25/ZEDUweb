// src/pages/student/FindTutors.tsx
import React, { useState, useEffect } from 'react';
import {
  Search, Users, BookOpen, Calendar as CalendarIcon,
  Award, Bell, UserPlus, X, Send
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  bio: string;
  location: string;
  country: string;
  rating: number;
  totalStudents: number;
  totalClasses: number;
  specialties: string[];
  languages: string[];
  price?: number;
  isVerified: boolean;
  responseTime: string;
}

interface Class {
  id: string;
  title: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  schedule: {
    day: string;
    time: string;
    duration: number;
  };
  capacity: number;
  enrolled: number;
  price: number;
  description: string;
  requirements: string[];
  nextSession?: Date;
}

interface JoinRequest {
  id: string;
  classId: string;
  tutorId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  respondedAt?: Date;
}

// Mock Data
const MOCK_CLASSES: Class[] = [
  {
    id: 'c1',
    title: 'Master Calculus: From Basics to Advanced',
    tutorId: 't1',
    tutorName: 'Dr. Sarah Johnson',
    subject: 'Mathematics',
    level: 'advanced',
    schedule: {
      day: 'Monday',
      time: '10:00 AM',
      duration: 90
    },
    capacity: 50,
    enrolled: 35,
    price: 0,
    description: 'Complete calculus course covering limits, derivatives, and integrals with real-world applications. Perfect for students preparing for exams or wanting to deepen their understanding.',
    requirements: ['Basic algebra', 'Dedication', 'Regular attendance'],
    nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'c2',
    title: 'Python Programming for Beginners',
    tutorId: 't2',
    tutorName: 'Prof. Michael Chen',
    subject: 'Computer Science',
    level: 'beginner',
    schedule: {
      day: 'Wednesday',
      time: '02:00 PM',
      duration: 120
    },
    capacity: 40,
    enrolled: 28,
    price: 0,
    description: 'Learn Python from scratch. No prior programming experience needed. Build real projects and gain practical skills.',
    requirements: ['Computer access', 'Internet connection'],
    nextSession: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'c3',
    title: 'Physics: Mechanics & Thermodynamics',
    tutorId: 't3',
    tutorName: 'Dr. Patricia Moyo',
    subject: 'Physics',
    level: 'intermediate',
    schedule: {
      day: 'Friday',
      time: '11:00 AM',
      duration: 90
    },
    capacity: 45,
    enrolled: 32,
    price: 0,
    description: 'Comprehensive physics course covering mechanics, thermodynamics, and wave physics with practical examples.',
    requirements: ['Basic math', 'Interest in physics'],
    nextSession: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'c4',
    title: 'English Literature & Composition',
    tutorId: 't4',
    tutorName: 'Dr. Elizabeth Dube',
    subject: 'English',
    level: 'intermediate',
    schedule: {
      day: 'Tuesday',
      time: '09:00 AM',
      duration: 90
    },
    capacity: 35,
    enrolled: 20,
    price: 0,
    description: 'Explore classic and contemporary literature while improving your writing skills.',
    requirements: ['Interest in reading', 'Basic English proficiency'],
    nextSession: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  }
];

export const FindTutors: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClasses(MOCK_CLASSES);
      
      // Load student's pending requests from localStorage
      const savedRequests = localStorage.getItem('pendingRequests');
      if (savedRequests) {
        setPendingRequests(JSON.parse(savedRequests));
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedClass || !requestMessage.trim()) return;

    const newRequest: JoinRequest = {
      id: Date.now().toString(),
      classId: selectedClass.id,
      tutorId: selectedClass.tutorId,
      studentId: 'current-student-id',
      studentName: 'Current Student',
      studentEmail: 'student@example.com',
      message: requestMessage,
      status: 'pending',
      requestedAt: new Date()
    };

    // Save to localStorage for demo
    const existingRequests = JSON.parse(localStorage.getItem('joinRequests') || '[]');
    localStorage.setItem('joinRequests', JSON.stringify([...existingRequests, newRequest]));
    
    // Track pending request IDs
    const updatedPending = [...pendingRequests, selectedClass.id];
    setPendingRequests(updatedPending);
    localStorage.setItem('pendingRequests', JSON.stringify(updatedPending));

    alert(`✅ Request sent to ${selectedClass.tutorName} for class "${selectedClass.title}"`);
    setShowRequestModal(false);
    setRequestMessage('');
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || cls.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesLevel = selectedLevel === 'all' || cls.level === selectedLevel;
    const notRequested = !pendingRequests.includes(cls.id);
    return matchesSearch && matchesSubject && matchesLevel && notRequested;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a Tutor</h1>
        <p className="text-gray-600 mt-1">
          Connect with quality teachers worldwide. Request to join their classes for free.
        </p>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Award className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Access Quality Education Anywhere</p>
            <p>Can't find a quality teacher in your area? Request to join classes from expert tutors worldwide. All classes are completely FREE!</p>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by class, subject, or tutor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="computer science">Computer Science</option>
            <option value="english">English</option>
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Found {filteredClasses.length} classes available
        </p>
        <Button variant="ghost" size="sm" onClick={() => navigate('/student/my-requests')}>
          View My Requests →
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Tutor Info */}
              <div className="flex items-center space-x-3 mb-4">
                <Avatar name={cls.tutorName} size="md" />
                <div>
                  <p className="font-semibold text-gray-900">{cls.tutorName}</p>
                  <p className="text-sm text-gray-500">{cls.subject}</p>
                </div>
              </div>

              {/* Class Info */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{cls.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cls.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {cls.schedule.day}, {cls.schedule.time} ({cls.schedule.duration} min)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {cls.enrolled}/{cls.capacity} students enrolled
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Level: {cls.level.charAt(0).toUpperCase() + cls.level.slice(1)}
                </div>
              </div>

              {/* Requirements Preview */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-medium mb-1">Requirements:</p>
                <div className="flex flex-wrap gap-1">
                  {cls.requirements.slice(0, 2).map((req, i) => (
                    <Badge key={i} variant="secondary" size="sm">
                      {req}
                    </Badge>
                  ))}
                  {cls.requirements.length > 2 && (
                    <span className="text-xs text-gray-400">+{cls.requirements.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Badge className="bg-green-100 text-green-800">Free Class</Badge>
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    setSelectedClass(cls);
                    setShowRequestModal(true);
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Request to Join
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find classes.
          </p>
        </Card>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Request to Join Class</h2>
                  <p className="text-gray-600">{selectedClass.title}</p>
                  <p className="text-sm text-gray-500">with {selectedClass.tutorName}</p>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to join this class?
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell the tutor about yourself and why you're interested in this class..."
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> The tutor will review your request and notify you once approved. This helps ensure quality education for all students.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSendRequest}
                  disabled={!requestMessage.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
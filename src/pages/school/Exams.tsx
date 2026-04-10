// src/pages/school/Exams.tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, BookOpen, Users,
  Plus, Trash2, Eye, Download,
  CheckCircle, Search,
  Award, FileText
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import schoolAPI from '../../api/school.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Exam {
  id: string;
  name: string;
  type: 'test' | 'midterm' | 'final' | 'quiz' | 'practical';
  term: string;
  academicYear: string;
  class: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passMark: number;
  venue: string;
  invigilators: Array<{
    id: string;
    name: string;
  }>;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  results?: {
    published: boolean;
    publishedAt?: Date;
    average: number;
    highest: number;
    lowest: number;
    passed: number;
    failed: number;
  };
}

interface ExamSchedule {
  id: string;
  date: Date;
  exams: Exam[];
}

export const Exams: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [schedule, setSchedule] = useState<ExamSchedule[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockExams: Exam[] = [
        {
          id: '1',
          name: 'Mathematics Final Examination',
          type: 'final',
          term: 'Term 1',
          academicYear: '2024',
          class: { id: 'form1a', name: 'Form 1A' },
          subject: { id: 'math', name: 'Mathematics', code: 'MATH101' },
          date: new Date(Date.now() + 7 * 86400000),
          startTime: '09:00',
          endTime: '12:00',
          duration: 180,
          totalMarks: 100,
          passMark: 50,
          venue: 'Hall A',
          invigilators: [{ id: 't1', name: 'Mr. John Doe' }],
          status: 'scheduled'
        },
        {
          id: '2',
          name: 'English Midterm',
          type: 'midterm',
          term: 'Term 1',
          academicYear: '2024',
          class: { id: 'form1a', name: 'Form 1A' },
          subject: { id: 'eng', name: 'English', code: 'ENG101' },
          date: new Date(Date.now() + 3 * 86400000),
          startTime: '10:00',
          endTime: '12:00',
          duration: 120,
          totalMarks: 50,
          passMark: 25,
          venue: 'Hall B',
          invigilators: [{ id: 't2', name: 'Ms. Jane Smith' }],
          status: 'scheduled'
        },
        {
          id: '3',
          name: 'Science Quiz',
          type: 'quiz',
          term: 'Term 1',
          academicYear: '2024',
          class: { id: 'form1b', name: 'Form 1B' },
          subject: { id: 'sci', name: 'Science', code: 'SCI101' },
          date: new Date(Date.now() - 2 * 86400000),
          startTime: '11:00',
          endTime: '12:00',
          duration: 60,
          totalMarks: 30,
          passMark: 15,
          venue: 'Lab 1',
          invigilators: [{ id: 't3', name: 'Dr. Robert Brown' }],
          status: 'completed',
          results: {
            published: true,
            publishedAt: new Date(),
            average: 78,
            highest: 95,
            lowest: 45,
            passed: 25,
            failed: 5
          }
        }
      ];
      
      const mockSchedule: ExamSchedule[] = [
        {
          id: '1',
          date: new Date(Date.now() + 3 * 86400000),
          exams: [mockExams[1]]
        },
        {
          id: '2',
          date: new Date(Date.now() + 7 * 86400000),
          exams: [mockExams[0]]
        }
      ];
      
      setExams(mockExams);
      setSchedule(mockSchedule);
    } catch (error) {
      toast.error('Failed to load exams');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      // In a real app, you would call: await schoolAPI.deleteExam(examId);
      setExams(prev => prev.filter(e => e.id !== examId));
      toast.success('Exam deleted successfully');
    } catch (error) {
      toast.error('Failed to delete exam');
      console.error(error);
    }
  };

  const handleExportExam = async (examId: string) => {
    try {
      await schoolAPI.generateReport('exam', undefined, examId);
      toast.success('Exam details exported');
    } catch (error) {
      toast.error('Failed to export exam details');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExamTypeIcon = (type: string) => {
    switch (type) {
      case 'test': return <FileText className="w-4 h-4" />;
      case 'midterm': return <BookOpen className="w-4 h-4" />;
      case 'final': return <Award className="w-4 h-4" />;
      case 'quiz': return <Clock className="w-4 h-4" />;
      case 'practical': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || exam.class.id === selectedClass;
    const matchesSubject = selectedSubject === 'all' || exam.subject.id === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus;
    
    let matchesTab = true;
    if (activeTab === 'upcoming') {
      matchesTab = exam.status === 'scheduled';
    } else if (activeTab === 'ongoing') {
      matchesTab = exam.status === 'ongoing';
    } else if (activeTab === 'completed') {
      matchesTab = exam.status === 'completed';
    }
    
    return matchesSearch && matchesClass && matchesSubject && matchesStatus && matchesTab;
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Examinations Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Exams</p>
              <p className="text-2xl font-bold">{exams.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-700">
                {exams.filter(e => e.status === 'scheduled').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Ongoing</p>
              <p className="text-2xl font-bold text-green-700">
                {exams.filter(e => e.status === 'ongoing').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-700">
                {exams.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Classes</option>
            <option value="form1a">Form 1A</option>
            <option value="form1b">Form 1B</option>
            <option value="form2a">Form 2A</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Subjects</option>
            <option value="math">Mathematics</option>
            <option value="eng">English</option>
            <option value="sci">Science</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Simple Tabs Implementation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'ongoing', label: 'Ongoing' },
            { id: 'completed', label: 'Completed' },
            { id: 'schedule', label: 'Schedule View' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

      {/* Exam Cards */}
      {activeTab !== 'schedule' && (
        <div className="space-y-4">
          {filteredExams.map(exam => (
            <Card key={exam.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      exam.type === 'final' ? 'bg-purple-100' :
                      exam.type === 'midterm' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {getExamTypeIcon(exam.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{exam.name}</h3>
                      <p className="text-sm text-gray-600">
                        {exam.subject.name} • {exam.class.name}
                      </p>
                    </div>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {exam.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{format(exam.date, 'EEEE, MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{exam.startTime} - {exam.endTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-gray-400 mr-2" />
                      <span>Marks: {exam.totalMarks} (Pass: {exam.passMark})</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span>Venue: {exam.venue}</span>
                    </div>
                  </div>

                  {exam.results && exam.results.published && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Average</p>
                          <p className="font-semibold">{exam.results.average}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Highest</p>
                          <p className="font-semibold text-green-600">{exam.results.highest}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Lowest</p>
                          <p className="font-semibold text-red-600">{exam.results.lowest}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Passed</p>
                          <p className="font-semibold text-green-600">{exam.results.passed}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Failed</p>
                          <p className="font-semibold text-red-600">{exam.results.failed}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportExam(exam.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {exam.status === 'scheduled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExam(exam.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule View */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {schedule.map(day => (
            <Card key={day.id} className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {format(day.date, 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="space-y-3">
                {day.exams.map(exam => (
                  <div key={exam.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-24 text-sm font-medium">
                      {exam.startTime} - {exam.endTime}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium">{exam.subject.name}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{exam.class.name}</span>
                        <Badge className={`ml-3 ${getStatusColor(exam.status)}`}>
                          {exam.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">Venue: {exam.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
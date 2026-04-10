// src/pages/school/Classes.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, Plus, Edit2, Trash2,
  Eye, Search, Download,
  TrendingUp, Award
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
//import schoolAPI from '../../api/school.api';
import { toast } from 'react-hot-toast';

interface Class {
  id: string;
  name: string;
  grade: string;
  stream?: string;
  academicYear: string;
  capacity: number;
  enrolled: number;
  homeroomTeacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  subjects: Array<{
    id: string;
    name: string;
    teacher: {
      id: string;
      name: string;
    };
    hoursPerWeek: number;
  }>;
  students: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  performance: {
    average: number;
    attendance: number;
    topStudent?: string;
  };
  schedule: Array<{
    day: string;
    period: number;
    subject: string;
    teacher: string;
    room: string;
  }>;
}

export const Classes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockClasses: Class[] = [
        {
          id: '1',
          name: 'Form 1A',
          grade: 'Form 1',
          stream: 'A',
          academicYear: '2024',
          capacity: 30,
          enrolled: 28,
          homeroomTeacher: {
            id: 't1',
            name: 'Mr. John Doe',
            avatar: ''
          },
          subjects: [
            {
              id: 'sub1',
              name: 'Mathematics',
              teacher: { id: 't1', name: 'Mr. John Doe' },
              hoursPerWeek: 5
            },
            {
              id: 'sub2',
              name: 'English',
              teacher: { id: 't2', name: 'Ms. Jane Smith' },
              hoursPerWeek: 4
            }
          ],
          students: [
            { id: 's1', name: 'John Student', avatar: '' },
            { id: 's2', name: 'Jane Student', avatar: '' }
          ],
          performance: {
            average: 85,
            attendance: 92,
            topStudent: 'John Student'
          },
          schedule: [
            { day: 'Monday', period: 1, subject: 'Mathematics', teacher: 'Mr. John Doe', room: '101' },
            { day: 'Monday', period: 2, subject: 'English', teacher: 'Ms. Jane Smith', room: '102' }
          ]
        },
        {
          id: '2',
          name: 'Form 1B',
          grade: 'Form 1',
          stream: 'B',
          academicYear: '2024',
          capacity: 30,
          enrolled: 25,
          homeroomTeacher: {
            id: 't3',
            name: 'Mrs. Sarah Johnson',
            avatar: ''
          },
          subjects: [
            {
              id: 'sub3',
              name: 'Mathematics',
              teacher: { id: 't1', name: 'Mr. John Doe' },
              hoursPerWeek: 5
            },
            {
              id: 'sub4',
              name: 'Science',
              teacher: { id: 't4', name: 'Dr. Robert Brown' },
              hoursPerWeek: 4
            }
          ],
          students: [
            { id: 's3', name: 'Bob Student', avatar: '' },
            { id: 's4', name: 'Alice Student', avatar: '' }
          ],
          performance: {
            average: 82,
            attendance: 88,
            topStudent: 'Alice Student'
          },
          schedule: [
            { day: 'Monday', period: 1, subject: 'Mathematics', teacher: 'Mr. John Doe', room: '101' },
            { day: 'Monday', period: 2, subject: 'Science', teacher: 'Dr. Robert Brown', room: '103' }
          ]
        },
        {
          id: '3',
          name: 'Form 2A',
          grade: 'Form 2',
          stream: 'A',
          academicYear: '2024',
          capacity: 32,
          enrolled: 30,
          homeroomTeacher: {
            id: 't5',
            name: 'Mr. Michael Lee',
            avatar: ''
          },
          subjects: [
            {
              id: 'sub5',
              name: 'Mathematics',
              teacher: { id: 't5', name: 'Mr. Michael Lee' },
              hoursPerWeek: 5
            },
            {
              id: 'sub6',
              name: 'History',
              teacher: { id: 't6', name: 'Ms. Emily Davis' },
              hoursPerWeek: 3
            }
          ],
          students: [
            { id: 's5', name: 'Tom Student', avatar: '' },
            { id: 's6', name: 'Sarah Student', avatar: '' }
          ],
          performance: {
            average: 88,
            attendance: 90,
            topStudent: 'Sarah Student'
          },
          schedule: [
            { day: 'Monday', period: 1, subject: 'Mathematics', teacher: 'Mr. Michael Lee', room: '201' },
            { day: 'Monday', period: 2, subject: 'History', teacher: 'Ms. Emily Davis', room: '202' }
          ]
        }
      ];
      
      setClasses(mockClasses);
    } catch (error) {
      toast.error('Failed to load classes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        // In a real app, you would call: await schoolAPI.deleteClass(classId);
        setClasses(prev => prev.filter(c => c.id !== classId));
        toast.success('Class deleted successfully');
      } catch (error) {
        toast.error('Failed to delete class');
        console.error(error);
      }
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.homeroomTeacher.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || cls.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
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
        <h1 className="text-2xl font-bold">Classes</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Classes</p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">
                {classes.reduce((acc, cls) => acc + cls.enrolled, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Class Size</p>
              <p className="text-2xl font-bold">
                {Math.round(classes.reduce((acc, cls) => acc + cls.enrolled, 0) / classes.length)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Performance</p>
              <p className="text-2xl font-bold">
                {Math.round(classes.reduce((acc, cls) => acc + cls.performance.average, 0) / classes.length)}%
              </p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Grades</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
            <option value="Form 5">Form 5</option>
            <option value="Form 6">Form 6</option>
            <option value="vocational">voc</option>
            <option value="tertiary">ter</option>
            <option value="university">uni</option>
          </select>
        </div>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map(cls => (
          <Card key={cls.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{cls.name}</h3>
                <p className="text-sm text-gray-600">
                  {cls.grade} {cls.stream && `• ${cls.stream}`}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {cls.academicYear}
              </Badge>
            </div>

            <div className="flex items-center mb-3">
              <Avatar
                src={cls.homeroomTeacher.avatar}
                name={cls.homeroomTeacher.name}
                size="sm"
                className="mr-2"
              />
              <div>
                <p className="text-sm font-medium">{cls.homeroomTeacher.name}</p>
                <p className="text-xs text-gray-500">Homeroom Teacher</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded">
                <Users className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <p className="text-sm font-medium">{cls.enrolled}/{cls.capacity}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <BookOpen className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <p className="text-sm font-medium">{cls.subjects.length}</p>
                <p className="text-xs text-gray-500">Subjects</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Average Grade</span>
                  <span className="font-medium">{cls.performance.average}%</span>
                </div>
                <ProgressBar value={cls.performance.average} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Attendance</span>
                  <span className="font-medium">{cls.performance.attendance}%</span>
                </div>
                <ProgressBar value={cls.performance.attendance} />
              </div>
            </div>

            <div className="pt-3 border-t flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Top: {cls.performance.topStudent || 'N/A'}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedClass(cls)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
                <p className="text-gray-600">{selectedClass.grade} • {selectedClass.academicYear}</p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4 text-center">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{selectedClass.enrolled}</p>
                <p className="text-sm text-gray-500">Enrolled Students</p>
              </Card>
              <Card className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{selectedClass.subjects.length}</p>
                <p className="text-sm text-gray-500">Subjects</p>
              </Card>
              <Card className="p-4 text-center">
                <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{selectedClass.performance.average}%</p>
                <p className="text-sm text-gray-500">Average Grade</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Subjects */}
              <div>
                <h3 className="font-semibold mb-3">Subjects</h3>
                <div className="space-y-2">
                  {selectedClass.subjects.map(subject => (
                    <div key={subject.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-gray-600">{subject.teacher.name}</p>
                        </div>
                        <span className="text-sm text-gray-500">{subject.hoursPerWeek} hrs/wk</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Preview */}
              <div>
                <h3 className="font-semibold mb-3">Today's Schedule</h3>
                <div className="space-y-2">
                  {selectedClass.schedule
                    .filter(s => s.day === 'Monday')
                    .slice(0, 5)
                    .map((slot, index) => (
                      <div key={index} className="flex items-center p-2 border rounded">
                        <span className="w-12 text-sm font-medium">P{slot.period}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{slot.subject}</p>
                          <p className="text-xs text-gray-500">{slot.teacher} • {slot.room}</p>
                        </div>
                      </div>
                    ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  View Full Schedule
                </Button>
              </div>
            </div>

            {/* Student List */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Students ({selectedClass.students.length})</h3>
              <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {selectedClass.students.map(student => (
                  <div key={student.id} className="flex items-center p-2 bg-gray-50 rounded">
                    <Avatar src={student.avatar} name={student.name} size="sm" className="mr-2" />
                    <span className="text-sm truncate">{student.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedClass(null)}>
                Close
              </Button>
              <Button>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Class
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
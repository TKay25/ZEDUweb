import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search,
  Calendar, Award, TrendingUp,
  Mail, Phone,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import parentAPI from '../../api/parent.api';
import type { Child } from '../../api/parent.api';
import { format } from 'date-fns';

// Remove the local Child interface - use the imported one from parent.api.ts instead
// The imported Child has these properties:
// id, firstName, lastName, email, avatar?, grade, enrolledCourses, averageGrade, attendance, lastActive

// We need to adapt our component to use the actual API structure
interface ExtendedChild extends Child {
  // Additional properties needed for the UI that aren't in the API
  name: string;
  class: string;
  school: string;
  schoolId: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  academics: {
    currentAverage: number;
    subjects: Array<{
      name: string;
      grade: number;
      teacher: string;
    }>;
    recentGrades: Array<{
      subject: string;
      assignment: string;
      score: number;
      total: number;
      date: Date;
    }>;
  };
  upcoming: {
    assignments: Array<{
      id: string;
      title: string;
      subject: string;
      dueDate: Date;
      status: string;
    }>;
    exams: Array<{
      id: string;
      subject: string;
      date: Date;
      topics: string[];
    }>;
  };
  teachers: Array<{
    id: string;
    name: string;
    subject: string;
    email: string;
    phone: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'attendance' | 'grade' | 'behavior' | 'payment';
    message: string;
    date: Date;
    severity: 'info' | 'warning' | 'critical';
  }>;
}

export const Children: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ExtendedChild[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const data = await parentAPI.getChildren();
      // Transform the API data to match our ExtendedChild interface
      const extendedChildren: ExtendedChild[] = data.map(child => ({
        ...child,
        name: `${child.firstName} ${child.lastName}`,
        class: `Form ${child.grade}`,
        school: 'Zedu Academy',
        schoolId: child.id,
        dateOfBirth: new Date(), // This should come from API
        enrollmentDate: new Date(), // This should come from API
        academics: {
          currentAverage: child.averageGrade,
          subjects: [], // This should come from API
          recentGrades: [] // This should come from API
        },
        upcoming: {
          assignments: [], // This should come from API
          exams: [] // This should come from API
        },
        teachers: [], // This should come from API
        alerts: [] // This should come from API
      }));
      setChildren(extendedChildren);
    } catch (error) {
      console.error('Failed to load children:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGrade === 'all' || child.grade.toString() === selectedGrade)
  );

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'attendance': return <Calendar className="w-4 h-4" />;
      case 'grade': return <Award className="w-4 h-4" />;
      case 'behavior': return <AlertCircle className="w-4 h-4" />;
      case 'payment': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h1 className="text-2xl font-bold">My Children</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => navigate('/parent/communications')}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Teachers
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search children..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Grades</option>
            <option value="1">Form 1</option>
            <option value="2">Form 2</option>
            <option value="3">Form 3</option>
            <option value="4">Form 4</option>
            <option value="5">Form 5</option>
            <option value="6">Form 6</option>
          </select>
        </div>
      </Card>

      {/* Children List */}
      <div className="space-y-4">
        {filteredChildren.map((child) => (
          <Card
            key={child.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setExpandedChild(expandedChild === child.id ? null : child.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Avatar
                  src={child.avatar}
                  name={child.name}
                  size="lg"
                  className="mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">{child.name}</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-600">Form {child.grade}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{child.class}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{child.school}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Attendance</div>
                  <div className={`text-lg font-semibold ${
                    child.attendance >= 90 ? 'text-green-600' :
                    child.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {child.attendance}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Average</div>
                  <div className={`text-lg font-semibold ${
                    child.academics.currentAverage >= 80 ? 'text-green-600' :
                    child.academics.currentAverage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {child.academics.currentAverage}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Assignments</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {child.upcoming.assignments.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {child.alerts.length > 0 && (
              <div className="mt-4 flex space-x-2">
                {child.alerts.slice(0, 3).map(alert => (
                  <Badge key={alert.id} className={getSeverityColor(alert.severity)}>
                    <span className="flex items-center">
                      {getAlertIcon(alert.type)}
                      <span className="ml-1">{alert.message}</span>
                    </span>
                  </Badge>
                ))}
                {child.alerts.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-800">
                    +{child.alerts.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Expanded Details */}
            {expandedChild === child.id && (
              <div className="mt-6 pt-6 border-t">
                {/* Subject Grades */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Subject Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {child.academics.subjects.map(subject => (
                      <div key={subject.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-gray-500">{subject.teacher}</p>
                        </div>
                        <div className={`text-lg font-bold ${
                          subject.grade >= 80 ? 'text-green-600' :
                          subject.grade >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {subject.grade}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Grades */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Recent Grades</h3>
                  <div className="space-y-2">
                    {child.academics.recentGrades.map((grade, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border-b">
                        <div>
                          <p className="font-medium">{grade.assignment}</p>
                          <p className="text-sm text-gray-500">{grade.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{grade.score}/{grade.total}</p>
                          <p className="text-xs text-gray-500">
                            {format(grade.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Upcoming Assignments</h3>
                    <div className="space-y-2">
                      {child.upcoming.assignments.map(assignment => (
                        <div key={assignment.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-gray-600">{assignment.subject}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-orange-100 text-orange-800">
                              Due {format(assignment.dueDate, 'MMM d')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Upcoming Exams</h3>
                    <div className="space-y-2">
                      {child.upcoming.exams.map(exam => (
                        <div key={exam.id} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <div>
                            <p className="font-medium">{exam.subject}</p>
                            <p className="text-xs text-gray-500">{exam.topics.join(', ')}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-purple-100 text-purple-800">
                              {format(exam.date, 'MMM d')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Teachers */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Teachers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {child.teachers.map(teacher => (
                      <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-gray-500">{teacher.subject}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-white rounded-full">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-white rounded-full">
                            <Phone className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => navigate(`/parent/child-progress/${child.id}`)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/parent/child-grades/${child.id}`)}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View Grades
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/parent/child-attendance/${child.id}`)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Attendance
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredChildren.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Children Found</h3>
          <p className="text-gray-500">
            No children match your search criteria
          </p>
        </Card>
      )}
    </div>
  );
};
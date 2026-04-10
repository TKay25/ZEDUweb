import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Award, TrendingUp, Download,
  ChevronLeft, Star, BookOpen,
  Eye, Printer,
  BarChart2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import parentAPI from '../../api/parent.api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';

interface GradeData {
  childId: string;
  childName: string;
  overall: {
    current: number;
    previous: number;
    trend: number;
    gpa: number;
    rank: number;
    totalStudents: number;
  };
  subjects: Array<{
    id: string;
    name: string;
    teacher: string;
    currentGrade: number;
    previousGrade: number;
    trend: number;
    assignments: Array<{
      id: string;
      name: string;
      score: number;
      total: number;
      percentage: number;
      date: Date;
      feedback?: string;
    }>;
    exams: Array<{
      id: string;
      name: string;
      score: number;
      total: number;
      percentage: number;
      date: Date;
      feedback?: string;
    }>;
    termGrades: Array<{
      term: string;
      grade: number;
    }>;
  }>;
  reportCards: Array<{
    id: string;
    term: string;
    year: string;
    date: Date;
    url: string;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ChildGrades: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<GradeData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadGrades();
  }, [childId]);

  const loadGrades = async () => {
    try {
      const response = await parentAPI.getChildGrades(childId!);
      setGrades(response);
    } catch (error) {
      console.error('Failed to load grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleExportReportCard = (reportCardId: string) => {
    window.open(`/api/report-cards/${reportCardId}/download`, '_blank');
  };

  if (loading || !grades) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/parent/children')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Children
          </Button>
          <h1 className="text-2xl font-bold">{grades.childName}'s Grades</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Average</p>
              <p className={`text-2xl font-bold ${getGradeColor(grades.overall.current)}`}>
                {grades.overall.current}%
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className={`w-4 h-4 mr-1 ${
              grades.overall.trend >= 0 ? 'text-green-500' : 'text-red-500'
            }`} />
            <span className={grades.overall.trend >= 0 ? 'text-green-600' : 'text-red-600'}>
              {grades.overall.trend >= 0 ? '+' : ''}{grades.overall.trend}%
            </span>
            <span className="text-gray-500 ml-2">vs last term</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">GPA</p>
              <p className="text-2xl font-bold text-blue-600">
                {grades.overall.gpa.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Out of 4.0</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Class Rank</p>
              <p className="text-2xl font-bold text-green-600">
                #{grades.overall.rank}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            of {grades.overall.totalStudents} students
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Subjects</p>
              <p className="text-2xl font-bold text-purple-600">
                {grades.subjects.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Enrolled</p>
        </Card>
      </div>

      {/* Tabs - Using button-based tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subjects'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Subject Details
          </button>
          <button
            onClick={() => setActiveTab('report-cards')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'report-cards'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Report Cards
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Grade Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={grades.subjects.map(s => ({
                      name: s.name,
                      value: s.currentGrade
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => {
                      const percentage = percent || 0;
                      return `${name} (${(percentage * 100).toFixed(0)}%)`;
                    }}
                  >
                    {grades.subjects.map((_entry, index) => (
  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>

              <div>
                <h4 className="font-medium mb-3">Grade Summary</h4>
                <div className="space-y-3">
                  {['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (Below 60)'].map((grade, index) => {
                    const count = grades.subjects.filter(s => {
                      if (index === 0) return s.currentGrade >= 90;
                      if (index === 1) return s.currentGrade >= 80 && s.currentGrade < 90;
                      if (index === 2) return s.currentGrade >= 70 && s.currentGrade < 80;
                      if (index === 3) return s.currentGrade >= 60 && s.currentGrade < 70;
                      return s.currentGrade < 60;
                    }).length;
                    
                    return (
                      <div key={grade} className="flex items-center">
                        <span className="w-24 text-sm">{grade}</span>
                        <div className="flex-1 mx-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-green-500' :
                                index === 1 ? 'bg-blue-500' :
                                index === 2 ? 'bg-yellow-500' :
                                index === 3 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(count / grades.subjects.length) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-8 text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Subject Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grades.subjects.map(subject => (
              <Card key={subject.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{subject.name}</h4>
                    <p className="text-sm text-gray-500">{subject.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                      {subject.currentGrade}%
                    </p>
                    <Badge className="mt-1">
                      {getGradeLetter(subject.currentGrade)}
                    </Badge>
                  </div>
                </div>

                <ProgressBar value={subject.currentGrade} className="h-2 mb-2" />

                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Previous: {subject.previousGrade}%</span>
                  <span className={subject.trend >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {subject.trend >= 0 ? '+' : ''}{subject.trend}%
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Subject Details Tab */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Subjects</option>
            {grades.subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {grades.subjects
            .filter(s => selectedSubject === 'all' || s.id === selectedSubject)
            .map(subject => (
              <Card key={subject.id} className="p-6">
                <h3 className="text-xl font-semibold mb-4">{subject.name}</h3>

                {/* Term Trend */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Term Performance</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={subject.termGrades}>
                      <XAxis dataKey="term" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="grade" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Assignments */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Assignments</h4>
                  <div className="space-y-3">
                    {subject.assignments.map(assignment => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{assignment.name}</p>
                          <p className="text-sm text-gray-500">
                            {format(assignment.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right mr-4">
                          <p className={`font-semibold ${getGradeColor(assignment.percentage)}`}>
                            {assignment.score}/{assignment.total}
                          </p>
                          <p className="text-xs text-gray-500">
                            {assignment.percentage}%
                          </p>
                        </div>
                        {assignment.feedback && (
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exams */}
                <div>
                  <h4 className="font-medium mb-3">Exams</h4>
                  <div className="space-y-3">
                    {subject.exams.map(exam => (
                      <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{exam.name}</p>
                          <p className="text-sm text-gray-500">
                            {format(exam.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right mr-4">
                          <p className={`font-semibold ${getGradeColor(exam.percentage)}`}>
                            {exam.score}/{exam.total}
                          </p>
                          <p className="text-xs text-gray-500">
                            {exam.percentage}%
                          </p>
                        </div>
                        {exam.feedback && (
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Report Cards Tab */}
      {activeTab === 'report-cards' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Report Cards</h3>
          <div className="space-y-4">
            {grades.reportCards.map(report => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{report.term} Term Report</h4>
                    <p className="text-sm text-gray-500">
                      {report.year} • Issued {format(report.date, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleExportReportCard(report.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
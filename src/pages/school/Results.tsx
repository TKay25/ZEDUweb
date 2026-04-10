// src/pages/school/Results.tsx
import React, { useState, useEffect } from 'react';
import {
  Award, Download, Printer, Eye,
  TrendingUp, Search,
  CheckCircle, XCircle,
  Users
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import schoolAPI from '../../api/school.api';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Result {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  examId: string;
  examName: string;
  subject: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks: string;
  position?: number;
  passed: boolean;
  publishedAt: Date;
}

interface ResultSummary {
  examId: string;
  examName: string;
  subject: string;
  totalStudents: number;
  average: number;
  highest: number;
  lowest: number;
  passed: number;
  failed: number;
  passPercentage: number;
  gradeDistribution: Array<{ grade: string; count: number }>;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  studentClass: string;
  results: Result[];
  totalMarks: number;
  average: number;
  position: number;
  remarks: string;
}

const GRADE_COLORS = {
  'A': '#10b981',
  'B': '#3b82f6',
  'C': '#f59e0b',
  'D': '#ef4444',
  'F': '#6b7280'
};

export const Results: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const [summary, setSummary] = useState<ResultSummary[]>([]);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadResults();
  }, [selectedExam, selectedClass]);

  const loadResults = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults: Result[] = [
        {
          id: '1',
          studentId: 's1',
          studentName: 'John Doe',
          studentClass: 'Form 1A',
          examId: 'exam1',
          examName: 'Final Examination',
          subject: 'Mathematics',
          marks: 85,
          totalMarks: 100,
          percentage: 85,
          grade: 'A',
          remarks: 'Excellent',
          passed: true,
          publishedAt: new Date()
        },
        {
          id: '2',
          studentId: 's2',
          studentName: 'Jane Smith',
          studentClass: 'Form 1A',
          examId: 'exam1',
          examName: 'Final Examination',
          subject: 'Mathematics',
          marks: 72,
          totalMarks: 100,
          percentage: 72,
          grade: 'B',
          remarks: 'Good',
          passed: true,
          publishedAt: new Date()
        },
        {
          id: '3',
          studentId: 's3',
          studentName: 'Bob Johnson',
          studentClass: 'Form 1A',
          examId: 'exam1',
          examName: 'Final Examination',
          subject: 'Mathematics',
          marks: 45,
          totalMarks: 100,
          percentage: 45,
          grade: 'F',
          remarks: 'Poor',
          passed: false,
          publishedAt: new Date()
        }
      ];
      
      const mockSummary: ResultSummary[] = [
        {
          examId: 'exam1',
          examName: 'Final Examination',
          subject: 'Mathematics',
          totalStudents: 30,
          average: 68,
          highest: 95,
          lowest: 35,
          passed: 22,
          failed: 8,
          passPercentage: 73,
          gradeDistribution: [
            { grade: 'A', count: 5 },
            { grade: 'B', count: 8 },
            { grade: 'C', count: 9 },
            { grade: 'D', count: 4 },
            { grade: 'F', count: 4 }
          ]
        },
        {
          examId: 'exam1',
          examName: 'Final Examination',
          subject: 'English',
          totalStudents: 30,
          average: 72,
          highest: 98,
          lowest: 40,
          passed: 25,
          failed: 5,
          passPercentage: 83,
          gradeDistribution: [
            { grade: 'A', count: 7 },
            { grade: 'B', count: 10 },
            { grade: 'C', count: 8 },
            { grade: 'D', count: 3 },
            { grade: 'F', count: 2 }
          ]
        }
      ];
      
      const mockStudentResults: StudentResult[] = [
        {
          studentId: 's1',
          studentName: 'John Doe',
          studentClass: 'Form 1A',
          results: mockResults.filter(r => r.studentId === 's1'),
          totalMarks: 85,
          average: 85,
          position: 1,
          remarks: 'Excellent performance'
        },
        {
          studentId: 's2',
          studentName: 'Jane Smith',
          studentClass: 'Form 1A',
          results: mockResults.filter(r => r.studentId === 's2'),
          totalMarks: 72,
          average: 72,
          position: 2,
          remarks: 'Good performance'
        },
        {
          studentId: 's3',
          studentName: 'Bob Johnson',
          studentClass: 'Form 1A',
          results: mockResults.filter(r => r.studentId === 's3'),
          totalMarks: 45,
          average: 45,
          position: 3,
          remarks: 'Needs improvement'
        }
      ];
      
      setResults(mockResults);
      setSummary(mockSummary);
      setStudentResults(mockStudentResults);
    } catch (error) {
      toast.error('Failed to load results');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResult = async (studentId: string, examId: string) => {
    try {
      await schoolAPI.generateReport('result', undefined, `${studentId}_${examId}`);
      toast.success('Result downloaded');
    } catch (error) {
      toast.error('Failed to download result');
      console.error(error);
    }
  };

  const handleEmailResult = async (studentId: string, examId: string) => {
    try {
      // This would be implemented in the API
      toast.success('Result sent via email');
      console.log('Email result for:', studentId, examId);
    } catch (error) {
      toast.error('Failed to send email');
      console.error(error);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRemarksBadge = (remarks: string) => {
    switch (remarks.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'below average': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
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
        <h1 className="text-2xl font-bold">Examination Results</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Exams</option>
            <option value="exam1">Final Examination</option>
            <option value="exam2">Mid-Term Examination</option>
          </select>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Classes</option>
            <option value="form1a">Form 1A</option>
            <option value="form1b">Form 1B</option>
            <option value="form2a">Form 2A</option>
          </select>
        </div>
      </Card>

      {/* Simple Tabs Implementation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'students', label: 'Student Results' },
            { id: 'analysis', label: 'Analysis' }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold">{results.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Passed</p>
                  <p className="text-2xl font-bold text-green-700">
                    {results.filter(r => r.passed).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-700">
                    {results.filter(r => !r.passed).length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Average</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {(results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Results by Exam */}
          {summary.map(exam => (
            <Card key={exam.examId} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{exam.examName} - {exam.subject}</h3>
                  <p className="text-sm text-gray-600">Total Students: {exam.totalStudents}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Pass Rate: {exam.passPercentage}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Average</p>
                  <p className="text-2xl font-bold text-primary-600">{exam.average}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Highest/Lowest</p>
                  <p className="text-lg">
                    <span className="text-green-600 font-bold">{exam.highest}%</span>
                    {' / '}
                    <span className="text-red-600 font-bold">{exam.lowest}%</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Grade Distribution</h4>
                <div className="space-y-2">
                  {exam.gradeDistribution.map(g => (
                    <div key={g.grade}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Grade {g.grade}</span>
                        <span className="text-gray-600">{g.count} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            g.grade === 'A' ? 'bg-green-500' :
                            g.grade === 'B' ? 'bg-blue-500' :
                            g.grade === 'C' ? 'bg-yellow-500' :
                            g.grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(g.count / exam.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Student Results Tab */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {studentResults
            .filter(s => s.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(student => (
              <Card key={student.studentId} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{student.studentName}</h3>
                        <p className="text-sm text-gray-500">{student.studentClass}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Overall Average</p>
                        <p className="text-2xl font-bold text-primary-600">
                          {student.average}%
                        </p>
                        <Badge className="mt-1">
                          Rank: #{student.position}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {student.results.map(result => (
                        <div key={result.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium w-32">{result.subject}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{result.examName}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`font-semibold ${getGradeColor(result.grade)}`}>
                              {result.marks}/{result.totalMarks} ({result.percentage}%)
                            </span>
                            <Badge className={getRemarksBadge(result.remarks)}>
                              {result.remarks}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadResult(student.studentId, 'all')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmailResult(student.studentId, 'all')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Subject Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={summary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#3b82f6" name="Average %" />
                <Bar dataKey="highest" fill="#10b981" name="Highest %" />
                <Bar dataKey="lowest" fill="#ef4444" name="Lowest %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Grade Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Overall Grade Distribution</h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(
                results.reduce((acc, r) => {
                  acc[r.grade] = (acc[r.grade] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([grade, count]) => (
                <Card key={grade} className="p-4 text-center">
                  <p className="text-3xl font-bold" style={{ color: GRADE_COLORS[grade as keyof typeof GRADE_COLORS] }}>
                    {grade}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-gray-500">students</p>
                </Card>
              ))}
            </div>
          </Card>

          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
            <div className="space-y-3">
              {studentResults
                .sort((a, b) => a.position - b.position)
                .slice(0, 5)
                .map(student => (
                  <div key={student.studentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-sm text-gray-500">{student.studentClass}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-600">{student.average}%</p>
                      <p className="text-sm text-gray-500">Rank #{student.position}</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
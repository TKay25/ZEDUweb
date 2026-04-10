import React, { useState, useEffect } from 'react';
import {
  Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { GradeCard } from '../../components/student/GradeCard';

// Define interfaces
interface GradeItem {
  name: string;
  score: number;
  total: number;
  weight: number;
}

interface Rank {
  current: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
}

interface Teacher {
  name: string;
  email: string;
}

interface CourseGrade {
  courseName: string;
  courseCode: string;
  overall: number;
  assignments: GradeItem[];
  exams: GradeItem[];
  attendance: number;
  rank: Rank;
  teacher: Teacher;
  semester: string;
  academicYear: string;
}

export const StudentGrades: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<CourseGrade[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('term1');
  const [overallGPA, setOverallGPA] = useState(0);

  useEffect(() => {
    loadGrades();
  }, [selectedTerm]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGrades: CourseGrade[] = [
        {
          courseName: 'Advanced Mathematics',
          courseCode: 'MATH301',
          overall: 87.5,
          assignments: [
            { name: 'Problem Set 1', score: 45, total: 50, weight: 10 },
            { name: 'Problem Set 2', score: 48, total: 50, weight: 10 },
            { name: 'Problem Set 3', score: 42, total: 50, weight: 10 },
            { name: 'Mid-term Exam', score: 85, total: 100, weight: 30 },
            { name: 'Final Exam', score: 92, total: 100, weight: 40 }
          ],
          exams: [
            { name: 'Mid-term Exam', score: 85, total: 100, weight: 30 },
            { name: 'Final Exam', score: 92, total: 100, weight: 40 }
          ],
          attendance: 95,
          rank: { current: 5, total: 156, trend: 'up' },
          teacher: { name: 'Dr. Sarah Johnson', email: 's.johnson@zedu.co.zw' },
          semester: 'Term 1',
          academicYear: '2024'
        },
        {
          courseName: 'Physics Fundamentals',
          courseCode: 'PHYS202',
          overall: 82.3,
          assignments: [
            { name: 'Lab Report 1', score: 88, total: 100, weight: 15 },
            { name: 'Lab Report 2', score: 92, total: 100, weight: 15 },
            { name: 'Problem Set', score: 76, total: 100, weight: 20 },
            { name: 'Mid-term Exam', score: 78, total: 100, weight: 25 },
            { name: 'Final Exam', score: 84, total: 100, weight: 25 }
          ],
          exams: [
            { name: 'Mid-term Exam', score: 78, total: 100, weight: 25 },
            { name: 'Final Exam', score: 84, total: 100, weight: 25 }
          ],
          attendance: 88,
          rank: { current: 12, total: 98, trend: 'stable' },
          teacher: { name: 'Prof. James Makoni', email: 'j.makoni@zedu.co.zw' },
          semester: 'Term 1',
          academicYear: '2024'
        },
        {
          courseName: 'Chemistry Essentials',
          courseCode: 'CHEM101',
          overall: 91.2,
          assignments: [
            { name: 'Lab Safety Quiz', score: 100, total: 100, weight: 5 },
            { name: 'Problem Set 1', score: 95, total: 100, weight: 15 },
            { name: 'Problem Set 2', score: 88, total: 100, weight: 15 },
            { name: 'Lab Report', score: 92, total: 100, weight: 25 },
            { name: 'Final Exam', score: 89, total: 100, weight: 40 }
          ],
          exams: [
            { name: 'Final Exam', score: 89, total: 100, weight: 40 }
          ],
          attendance: 98,
          rank: { current: 3, total: 87, trend: 'up' },
          teacher: { name: 'Dr. Tafadzwa Moyo', email: 't.moyo@zedu.co.zw' },
          semester: 'Term 1',
          academicYear: '2024'
        },
        {
          courseName: 'English Literature',
          courseCode: 'ENGL201',
          overall: 78.9,
          assignments: [
            { name: 'Essay 1', score: 82, total: 100, weight: 20 },
            { name: 'Essay 2', score: 75, total: 100, weight: 20 },
            { name: 'Poetry Analysis', score: 88, total: 100, weight: 20 },
            { name: 'Final Paper', score: 76, total: 100, weight: 40 }
          ],
          exams: [],
          attendance: 92,
          rank: { current: 28, total: 112, trend: 'down' },
          teacher: { name: 'Dr. Elizabeth Dube', email: 'e.dube@zedu.co.zw' },
          semester: 'Term 1',
          academicYear: '2024'
        }
      ];

      setGrades(mockGrades);
      
      const total = mockGrades.reduce((acc, g) => acc + g.overall, 0);
      setOverallGPA(total / mockGrades.length);
    } catch (error) {
      console.error('Failed to load grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeLetter = (percentage: number): { letter: string; color: string } => {
    if (percentage >= 90) return { letter: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { letter: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { letter: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { letter: 'D', color: 'text-orange-600' };
    return { letter: 'F', color: 'text-red-600' };
  };

  const getGradeColor = (percentage: number): 'green' | 'blue' | 'yellow' | 'red' => {
    if (percentage >= 90) return 'green';
    if (percentage >= 80) return 'blue';
    if (percentage >= 70) return 'yellow';
    return 'red';
  };

  const getAverageRank = (): number => {
    if (grades.length === 0) return 0;
    const totalRank = grades.reduce((acc, g) => acc + g.rank.current, 0);
    return Math.round(totalRank / grades.length);
  };

  const getGradeDistribution = (gradeRange: number): number => {
    let min, max;
    if (gradeRange === 0) { // A (90-100)
      min = 90; max = 100;
    } else if (gradeRange === 1) { // B (80-89)
      min = 80; max = 89;
    } else if (gradeRange === 2) { // C (70-79)
      min = 70; max = 79;
    } else if (gradeRange === 3) { // D (60-69)
      min = 60; max = 69;
    } else { // F (0-59)
      min = 0; max = 59;
    }
    return grades.filter(g => g.overall >= min && g.overall <= max).length;
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
          <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
          <p className="text-gray-600 mt-1">
            Track your academic performance across all courses
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="term1">Term 1 2024</option>
            <option value="term2">Term 2 2023</option>
            <option value="term3">Term 3 2023</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* GPA Overview */}
      <Card className="p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 mb-2">Overall GPA</p>
            <div className="flex items-end space-x-3">
              <span className="text-5xl font-bold">{overallGPA.toFixed(1)}%</span>
              <span className="text-2xl mb-1">{getGradeLetter(overallGPA).letter}</span>
            </div>
            <p className="text-primary-100 mt-2">
              Based on {grades.length} courses
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 mb-2">Class Rank</p>
            <p className="text-3xl font-bold">
              #{getAverageRank()}
            </p>
            <p className="text-primary-100 mt-2">
              Top {((getAverageRank() / 500) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Grade Distribution */}
      <div className="grid grid-cols-5 gap-4">
        {['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (0-59)'].map((grade, index) => {
          const count = getGradeDistribution(index);

          return (
            <Card key={grade} className="p-4 text-center">
              <p className="text-sm text-gray-500">{grade}</p>
              <p className="text-2xl font-bold text-primary-600">{count}</p>
              <p className="text-xs text-gray-500">
                {grades.length > 0 ? ((count / grades.length) * 100).toFixed(1) : 0}%
              </p>
            </Card>
          );
        })}
      </div>

      {/* Subject Performance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Subject Performance</h2>
        <div className="space-y-4">
          {grades.map((grade) => (
            <div key={grade.courseCode}>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="font-medium">{grade.courseName}</span>
                  <span className="text-sm text-gray-500 ml-2">{grade.courseCode}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`font-bold ${getGradeLetter(grade.overall).color}`}>
                    {grade.overall.toFixed(1)}%
                  </span>
                  <Badge className={
                    grade.overall >= 90 ? 'bg-green-100 text-green-800' :
                    grade.overall >= 80 ? 'bg-blue-100 text-blue-800' :
                    grade.overall >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {getGradeLetter(grade.overall).letter}
                  </Badge>
                </div>
              </div>
              <ProgressBar 
                value={grade.overall} 
                color={getGradeColor(grade.overall)}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Grade Cards */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Detailed Course Grades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grades.map((grade, index) => (
          <GradeCard
            key={index}
            grade={grade}
            onClick={() => console.log('View grade details', grade.courseCode)}
          />
        ))}
      </div>
    </div>
  );
};
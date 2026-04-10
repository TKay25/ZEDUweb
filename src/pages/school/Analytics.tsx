// src/pages/school/Analytics.tsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, GraduationCap,
  Award, Download, Activity, Target, Briefcase,
  Baby, School, BookOpen, Library
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import schoolAPI from '../../api/school.api';
import type { EducationLevel } from '../../api/school.api';
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

const LEVELS: { id: EducationLevel; label: string; icon: any }[] = [
  { id: 'ecd', label: 'ECD (Early Childhood)', icon: Baby },
  { id: 'primary', label: 'Primary School', icon: School },
  { id: 'secondary', label: 'Secondary School', icon: BookOpen },
  { id: 'tertiary', label: 'Tertiary College', icon: Library },
  { id: 'university', label: 'University', icon: GraduationCap }
];

// Mock data for demonstration
const mockECDData = {
  developmentalMilestones: [
    { milestone: 'Gross Motor', achieved: 85, target: 90 },
    { milestone: 'Fine Motor', achieved: 78, target: 85 },
    { milestone: 'Language', achieved: 82, target: 85 },
    { milestone: 'Social', achieved: 88, target: 85 },
    { milestone: 'Cognitive', achieved: 75, target: 80 }
  ],
  schoolReadiness: [
    { metric: 'Literacy Readiness', percentage: 82 },
    { metric: 'Numeracy Readiness', percentage: 78 },
    { metric: 'Social Readiness', percentage: 88 }
  ],
  immunizationCoverage: 95,
  parentInvolvement: 72
};

const mockPrimaryData = {
  literacyRate: 85,
  numeracyRate: 82,
  subjectPerformance: [
    { subject: 'English', average: 78 },
    { subject: 'Math', average: 75 },
    { subject: 'Science', average: 80 },
    { subject: 'Social Studies', average: 82 }
  ],
  transitionRate: 92
};

const mockSecondaryData = {
  examPassRate: 88,
  subjectPerformance: [
    { subject: 'Mathematics', average: 75 },
    { subject: 'English', average: 80 },
    { subject: 'Sciences', average: 78 },
    { subject: 'Humanities', average: 82 }
  ],
  universityPlacement: 75,
  careerGuidance: 68
};

const mockTertiaryData = {
  courseCompletionRate: 85,
  employmentRate: 78,
  internshipPlacement: 70,
  industryPartnerships: 25,
  certificationRate: 88
};

const mockUniversityData = {
  researchOutput: 120,
  publicationCount: 85,
  graduateEmploymentRate: 82,
  postgraduateEnrollment: 35,
  internationalStudents: 45,
  industryCollaborations: 40,
  citationIndex: 15.5
};

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('secondary');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    loadAnalytics();
  }, [selectedLevel, selectedYear]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      await schoolAPI.generateReport('analytics', selectedLevel, selectedYear);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
      console.error(error);
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
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-3">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as EducationLevel)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {LEVELS.map(level => (
              <option key={level.id} value={level.id}>{level.label}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {[2024, 2023, 2022, 2021, 2020].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Level-specific metrics */}
      {selectedLevel === 'ecd' && <ECDStats data={mockECDData} />}
      {selectedLevel === 'primary' && <PrimaryStats data={mockPrimaryData} />}
      {selectedLevel === 'secondary' && <SecondaryStats data={mockSecondaryData} />}
      {selectedLevel === 'tertiary' && <TertiaryStats data={mockTertiaryData} />}
      {selectedLevel === 'university' && <UniversityStats data={mockUniversityData} />}
    </div>
  );
};

// ECD Component
const ECDStats: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Immunization Coverage</p>
              <p className="text-2xl font-bold">{data.immunizationCoverage}%</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Parent Involvement</p>
              <p className="text-2xl font-bold">{data.parentInvolvement}%</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Developmental Milestones</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.developmentalMilestones}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="milestone" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="achieved" fill="#10b981" name="Achieved" />
            <Bar dataKey="target" fill="#3b82f6" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">School Readiness Metrics</h3>
        <div className="space-y-4">
          {data.schoolReadiness.map((item: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.metric}</span>
                <span className="font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Primary Component
const PrimaryStats: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Literacy Rate</p>
              <p className="text-2xl font-bold">{data.literacyRate}%</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Numeracy Rate</p>
              <p className="text-2xl font-bold">{data.numeracyRate}%</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transition Rate</p>
              <p className="text-2xl font-bold">{data.transitionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="average" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

// Secondary Component
const SecondaryStats: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Exam Pass Rate</p>
              <p className="text-2xl font-bold">{data.examPassRate}%</p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">University Placement</p>
              <p className="text-2xl font-bold">{data.universityPlacement}%</p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Career Guidance</p>
              <p className="text-2xl font-bold">{data.careerGuidance}%</p>
            </div>
            <Briefcase className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="average" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

// Tertiary Component
const TertiaryStats: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Course Completion</p>
              <p className="text-2xl font-bold">{data.courseCompletionRate}%</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Employment Rate</p>
              <p className="text-2xl font-bold">{data.employmentRate}%</p>
            </div>
            <Briefcase className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Industry Partnerships</p>
              <p className="text-2xl font-bold">{data.industryPartnerships}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Internship Placement</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {data.internshipPlacement}%
            </div>
            <p className="text-gray-600">Students Placed</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Certification Rate</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {data.certificationRate}%
            </div>
            <p className="text-gray-600">Professional Certifications</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// University Component
const UniversityStats: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Research Output</p>
              <p className="text-2xl font-bold">{data.researchOutput}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Publications</p>
              <p className="text-2xl font-bold">{data.publicationCount}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Graduate Employment</p>
              <p className="text-2xl font-bold">{data.graduateEmploymentRate}%</p>
            </div>
            <Briefcase className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">International Students</p>
              <p className="text-2xl font-bold">{data.internationalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Postgraduate Enrollment</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {data.postgraduateEnrollment}%
            </div>
            <p className="text-gray-600">Master's & PhD Students</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Industry Collaborations</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {data.industryCollaborations}
            </div>
            <p className="text-gray-600">Active Partnerships</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Citation Index</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {data.citationIndex}
            </div>
            <p className="text-gray-600">Research Impact Factor</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
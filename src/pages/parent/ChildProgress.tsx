import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp, Calendar, Award, BookOpen,
  Target, Download, ChevronLeft,
  Activity, ArrowUp, ArrowDown
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import parentAPI from '../../api/parent.api';
import type { ChildProgress as ChildProgressType } from '../../api/parent.api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ChildProgress: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ChildProgressType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [dateRange, setDateRange] = useState('6m');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProgress();
  }, [childId, dateRange]);

  const loadProgress = async () => {
    try {
      const data = await parentAPI.getChildProgress(childId!, dateRange);
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !progress) {
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
          <h1 className="text-2xl font-bold">{progress.childName}'s Progress</h1>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">This Year</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-primary-600">
                {progress.overall.average}%
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            {progress.overall.trend > 0 ? (
              <>
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{progress.overall.trend}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-red-600">{progress.overall.trend}%</span>
              </>
            )}
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Class Rank</p>
              <p className="text-2xl font-bold text-green-600">
                #{progress.overall.ranking}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            out of {progress.overall.totalStudents} students
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="text-2xl font-bold text-blue-600">
                {progress.overall.attendance}%
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Last 30 days
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assignments</p>
              <p className="text-2xl font-bold text-purple-600">
                {progress.overall.assignmentsCompleted}/{progress.overall.totalAssignments}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Completed
          </p>
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
            onClick={() => setActiveTab('timeline')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'predictions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Predictions
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'achievements'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Achievements
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Progress Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                {progress.subjects.map((subject, index) => (
                  <Line
                    key={subject.name}
                    type="monotone"
                    dataKey="score"
                    data={subject.scores}
                    name={subject.name}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Subject Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.subjects.map(subject => (
              <Card key={subject.name} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{subject.name}</h4>
                    <p className="text-sm text-gray-500">{subject.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-600">
                      {subject.average}%
                    </p>
                    <div className="flex items-center text-sm">
                      {subject.trend > 0 ? (
                        <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={subject.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                        {Math.abs(subject.trend)}%
                      </span>
                    </div>
                  </div>
                </div>

                <ProgressBar value={subject.average} className="h-2 mb-3" />

                <div className="flex space-x-2 text-xs">
                  <Badge className="bg-green-100 text-green-800">
                    {subject.strengths.length} strengths
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {subject.improvements.length} to improve
                  </Badge>
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
            {progress.subjects.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>

          {progress.subjects
            .filter(s => selectedSubject === 'all' || s.name === selectedSubject)
            .map(subject => (
              <Card key={subject.name} className="p-6">
                <h3 className="text-xl font-semibold mb-4">{subject.name}</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Score History</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={subject.scores}>
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#3b82f6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Strengths</h4>
                    <ul className="space-y-2 mb-4">
                      {subject.strengths.map((strength, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-medium mb-3">Areas for Improvement</h4>
                    <ul className="space-y-2">
                      {subject.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <Card className="p-6">
          <div className="space-y-6">
            {progress.timeline.map((day) => (
              <div key={day.date}>
                <h3 className="font-semibold mb-3">{format(new Date(day.date), 'MMMM d, yyyy')}</h3>
                <div className="space-y-3">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        event.type === 'grade' ? 'bg-green-100' :
                        event.type === 'attendance' ? 'bg-blue-100' :
                        event.type === 'assignment' ? 'bg-orange-100' : 'bg-purple-100'
                      }`}>
                        {event.type === 'grade' && <Award className="w-4 h-4 text-green-600" />}
                        {event.type === 'attendance' && <Calendar className="w-4 h-4 text-blue-600" />}
                        {event.type === 'assignment' && <BookOpen className="w-4 h-4 text-orange-600" />}
                        {event.type === 'achievement' && <Target className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          {event.value && (
                            <span className="font-bold text-primary-600">{event.value}%</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Prediction</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Predicted Next Score</p>
              <p className="text-4xl font-bold text-primary-600 mb-2">
                {progress.predictions.nextScore}%
              </p>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress.predictions.confidence / 100)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{progress.predictions.confidence}%</span>
                  </div>
                </div>
                <span className="ml-2 text-sm text-gray-600">confidence</span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Recommended Focus Areas</h4>
              <ul className="space-y-2">
                {progress.predictions.recommendedFocus.map((area, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <Target className="w-4 h-4 text-primary-600 mr-2 mt-0.5" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              Based on current performance, {progress.childName} is predicted to achieve a 
              <span className="font-bold"> {progress.predictions.predictedGrade}</span> in final examinations.
            </p>
          </div>
        </Card>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progress.achievements.map(achievement => (
            <Card key={achievement.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  achievement.type === 'academic' ? 'bg-green-100' :
                  achievement.type === 'attendance' ? 'bg-blue-100' :
                  achievement.type === 'behavior' ? 'bg-yellow-100' : 'bg-purple-100'
                }`}>
                  {achievement.type === 'academic' && <Award className="w-6 h-6 text-green-600" />}
                  {achievement.type === 'attendance' && <Calendar className="w-6 h-6 text-blue-600" />}
                  {achievement.type === 'behavior' && <Activity className="w-6 h-6 text-yellow-600" />}
                  {achievement.type === 'extracurricular' && <Target className="w-6 h-6 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(achievement.date, 'MMMM d, yyyy')}
                  </p>
                </div>
                {achievement.badge && (
                  <img src={achievement.badge} alt="badge" className="w-12 h-12" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
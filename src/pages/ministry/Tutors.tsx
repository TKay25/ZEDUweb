// src/pages/ministry/Tutors.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, Search, Download,
  Award, Star,
  Mail, MapPin, School,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import ministryAPI from '../../api/ministry.api';
import type { Tutor, TutorStats } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const MinistryTutors: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      const [tutorsData, statsData] = await Promise.all([
        ministryAPI.getTutors(),
        ministryAPI.getTutorStats()
      ]);
      setTutors(tutorsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTutor = async (tutorId: string) => {
    try {
      await ministryAPI.verifyTutor(tutorId);
      toast.success('Tutor verified successfully');
      loadTutors();
      setSelectedTutor(null);
    } catch (error) {
      toast.error('Failed to verify tutor');
    }
  };

  const handleSuspendTutor = async (tutorId: string) => {
    if (!window.confirm('Are you sure you want to suspend this tutor?')) return;
    
    try {
      await ministryAPI.suspendTutor(tutorId);
      toast.success('Tutor suspended');
      loadTutors();
      setSelectedTutor(null);
    } catch (error) {
      toast.error('Failed to suspend tutor');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.tutorNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvince = selectedProvince === 'all' || tutor.location.province.toLowerCase() === selectedProvince;
    
    const matchesSubject = selectedSubject === 'all' || 
      tutor.subjects.some(s => s.name.toLowerCase().includes(selectedSubject.toLowerCase()));
    
    return matchesSearch && matchesProvince && matchesSubject;
  });

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">National Tutor Registry</h1>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tutors</p>
              <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-700">{stats.active.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending.toLocaleString()}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Suspended</p>
              <p className="text-2xl font-bold text-red-700">{stats.suspended.toLocaleString()}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tutors by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bySubject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Provincial Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tutors by Province</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byProvince}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="count"
                label={({ name, percent }) => {
                  const province = name === 'harare' ? 'Harare' : 
                                   name === 'bulawayo' ? 'Bulawayo' :
                                   name === 'manicaland' ? 'Manicaland' :
                                   name === 'masvingo' ? 'Masvingo' :
                                   name === 'midlands' ? 'Midlands' : name;
                  return `${province} (${((percent || 0) * 100).toFixed(1)}%)`;
                }}
              >
                {stats.byProvince.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Provinces</option>
              <option value="harare">Harare</option>
              <option value="bulawayo">Bulawayo</option>
              <option value="manicaland">Manicaland</option>
              <option value="masvingo">Masvingo</option>
              <option value="midlands">Midlands</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="english">English</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="geography">Geography</option>
              <option value="shona">Shona</option>
              <option value="ndebele">Ndebele</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tutors Grid */}
      {filteredTutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutors.map(tutor => (
            <Card
              key={tutor.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTutor(tutor)}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
                <div className="flex items-center">
                  <Avatar
                    src={tutor.avatar}
                    name={tutor.name}
                    size="md"
                    className="mr-3 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold">{tutor.name}</h3>
                    <p className="text-xs text-gray-500">{tutor.tutorNumber}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge className={getStatusColor(tutor.status)}>
                    {tutor.status}
                  </Badge>
                  <Badge className={getVerificationColor(tutor.verification.status)}>
                    {tutor.verification.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{tutor.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{tutor.location.district}, {tutor.location.province}</span>
                </div>
                {tutor.school && (
                  <div className="flex items-center">
                    <School className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 truncate">{tutor.school.name}</span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {tutor.subjects.slice(0, 3).map(subject => (
                    <Badge key={subject.id} className="bg-blue-100 text-blue-800">
                      {subject.name}
                    </Badge>
                  ))}
                  {tutor.subjects.length > 3 && (
                    <Badge className="bg-gray-100 text-gray-800">
                      +{tutor.subjects.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <div className="flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{tutor.performance.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completion</p>
                  <span className="text-sm font-medium">{tutor.performance.completionRate}%</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Trend</p>
                  <span className={`text-sm font-medium ${
                    tutor.performance.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tutor.performance.trend > 0 ? '+' : ''}{tutor.performance.trend}%
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Tutors Found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedProvince !== 'all' || selectedSubject !== 'all'
              ? 'Try adjusting your filters'
              : 'No tutors have been registered yet'}
          </p>
        </Card>
      )}

      {/* Tutor Details Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={selectedTutor.avatar}
                  name={selectedTutor.name}
                  size="lg"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedTutor.name}</h2>
                  <p className="text-gray-600">{selectedTutor.tutorNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTutor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedTutor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedTutor.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{format(new Date(selectedTutor.dateOfBirth), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{selectedTutor.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{selectedTutor.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{selectedTutor.experience} years</p>
                </div>
              </div>

              {/* Qualifications */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Qualifications</h3>
                <div className="space-y-3">
                  {selectedTutor.qualifications.map((qual, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg">
                      <p className="font-medium">{qual.degree}</p>
                      <p className="text-sm text-gray-600">{qual.institution} • {qual.year}</p>
                      {qual.specialization && (
                        <p className="text-sm text-gray-500">Specialization: {qual.specialization}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTutor.subjects.map(subject => (
                    <Badge key={subject.id} className="bg-blue-100 text-blue-800">
                      {subject.name} ({subject.level})
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Employment */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Employment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{selectedTutor.employment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{format(new Date(selectedTutor.employment.startDate), 'MMMM d, yyyy')}</p>
                  </div>
                  {selectedTutor.employment.endDate && (
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{format(new Date(selectedTutor.employment.endDate), 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <Star className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedTutor.performance.rating}</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </Card>
                <Card className="p-4 text-center">
                  <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedTutor.performance.studentFeedback}%</p>
                  <p className="text-xs text-gray-500">Feedback</p>
                </Card>
                <Card className="p-4 text-center">
                  <Award className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedTutor.performance.completionRate}%</p>
                  <p className="text-xs text-gray-500">Completion</p>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {selectedTutor.verification.status === 'pending' && (
                  <Button onClick={() => handleVerifyTutor(selectedTutor.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Tutor
                  </Button>
                )}
                {selectedTutor.status === 'active' && (
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleSuspendTutor(selectedTutor.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Suspend Tutor
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
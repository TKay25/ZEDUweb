// src/pages/ministry/SchoolDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  School,
  Mail, Phone, MapPin,
  CheckCircle, AlertCircle,
  Download, Eye,
  FileText, Clock, Star,
  ChevronLeft
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { SchoolDetail as SchoolDetailType } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const SchoolDetail: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState<SchoolDetailType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSchoolDetail();
  }, [schoolId]);

  const loadSchoolDetail = async () => {
    try {
      const schoolData = await ministryAPI.getSchoolDetail(schoolId!);
      setSchool(schoolData);
    } catch (error) {
      toast.error('Failed to load school details');
      navigate('/ministry/schools');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySchool = async () => {
    try {
      await ministryAPI.verifySchool(schoolId!);
      toast.success('School verified successfully');
      loadSchoolDetail();
    } catch (error) {
      toast.error('Failed to verify school');
    }
  };

  const handleExportReport = async () => {
    try {
      await ministryAPI.exportSchoolReport(schoolId!);
      toast.success('School report exported');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !school) {
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
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/ministry/schools')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
          <h1 className="text-2xl font-bold">School Details</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          {school.verification.status === 'pending' && (
            <Button onClick={handleVerifySchool}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify School
            </Button>
          )}
        </div>
      </div>

      {/* School Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <School className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">{school.name}</h2>
                <Badge className={getStatusColor(school.verification.status)}>
                  {school.verification.status}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 capitalize">{school.type}</Badge>
                <Badge className="bg-green-100 text-green-800 capitalize">{school.ownership}</Badge>
              </div>
              <p className="text-gray-600 mt-1">Reg: {school.registrationNumber}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {school.district}, {school.province}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-1" />
                  {school.contact.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="w-4 h-4 mr-1" />
                  {school.contact.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-500">Head Teacher</p>
            <p className="font-semibold">{school.headTeacher.name}</p>
            <p className="text-sm text-gray-600">Since {format(new Date(school.headTeacher.since), 'MMM yyyy')}</p>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold">{school.stats.totalStudents.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Teachers</p>
          <p className="text-2xl font-bold">{school.stats.totalTeachers.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Student-Teacher Ratio</p>
          <p className="text-2xl font-bold">{school.stats.studentTeacherRatio}:1</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Pass Rate</p>
          <p className={`text-2xl font-bold ${
            school.stats.passRate >= 75 ? 'text-green-600' :
            school.stats.passRate >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {school.stats.passRate}%
          </p>
        </Card>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex flex-nowrap gap-4">
          {['overview', 'performance', 'compliance', 'staff', 'facilities', 'documents', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'overview' ? 'Overview' :
               tab === 'performance' ? 'Performance' :
               tab === 'compliance' ? 'Compliance' :
               tab === 'staff' ? 'Staff' :
               tab === 'facilities' ? 'Facilities' :
               tab === 'documents' ? 'Documents' : 'Activity'}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Yearly Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={school.performance.yearly}>
                  <defs>
                    <linearGradient id="passRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="passRate" stroke="#3b82f6" fillOpacity={1} fill="url(#passRateGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={school.performance.bySubject}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="School" />
                  <Bar dataKey="nationalAverage" fill="#9ca3af" name="National Average" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Grade Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance by Grade</h3>
            <div className="space-y-4">
              {school.performance.byGrade.map(grade => (
                <div key={grade.grade}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                    <span className="font-medium">Grade {grade.grade}</span>
                    <div className="flex flex-wrap items-center gap-4 mt-1 sm:mt-0">
                      <span className="text-sm text-gray-500">{grade.students} students</span>
                      <span className={`font-semibold ${
                        grade.passRate >= 75 ? 'text-green-600' :
                        grade.passRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {grade.passRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${grade.passRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Yearly Performance Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={school.performance.yearly}>
                <defs>
                  <linearGradient id="passRateGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="passRate" stroke="#3b82f6" fillOpacity={1} fill="url(#passRateGradient2)" name="Pass Rate %" />
                <Area yAxisId="right" type="monotone" dataKey="enrollment" stroke="#10b981" fillOpacity={0.3} fill="#10b981" name="Enrollment" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Subject Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={school.performance.bySubject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#3b82f6" name="School Score" />
                <Bar dataKey="nationalAverage" fill="#9ca3af" name="National Average" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Certifications */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Certifications</h3>
            <div className="space-y-4">
              {school.compliance.certifications.length > 0 ? (
                school.compliance.certifications.map(cert => (
                  <div key={cert.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                      <h4 className="font-semibold">{cert.name}</h4>
                      <p className="text-sm text-gray-600">Issued by: {cert.issuedBy}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                        <span>Issued: {format(new Date(cert.issuedDate), 'MMM d, yyyy')}</span>
                        <span>Expires: {format(new Date(cert.expiryDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <Badge className={
                      cert.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {cert.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No certifications available</p>
              )}
            </div>
          </Card>

          {/* Inspections */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inspection History</h3>
            <div className="space-y-4">
              {school.compliance.inspections.length > 0 ? (
                school.compliance.inspections.map(inspection => (
                  <div key={inspection.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                      <div>
                        <h4 className="font-medium">Inspection by {inspection.inspector}</h4>
                        <p className="text-sm text-gray-500">{format(new Date(inspection.date), 'MMMM d, yyyy')}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-bold">{inspection.rating}/5</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Findings:</span> {inspection.findings}</p>
                      <p className="text-sm"><span className="font-medium">Recommendations:</span> {inspection.recommendations}</p>
                    </div>
                    {inspection.followUpDate && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-yellow-600">
                          Follow-up required by {format(new Date(inspection.followUpDate), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No inspections available</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teachers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Teachers ({school.staff.teachers.length})</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {school.staff.teachers.length > 0 ? (
                school.staff.teachers.map(teacher => (
                  <div key={teacher.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{teacher.name}</h4>
                    <p className="text-sm text-gray-600">{teacher.subject}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <span className="font-medium mr-1">Qualification:</span> {teacher.qualification}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {teacher.experience} years exp
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No teachers found</p>
              )}
            </div>
          </Card>

          {/* Administration */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Administration ({school.staff.administration.length})</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {school.staff.administration.length > 0 ? (
                school.staff.administration.map(admin => (
                  <div key={admin.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{admin.name}</h4>
                    <p className="text-sm text-gray-600">{admin.role}</p>
                    <p className="text-xs text-gray-500 mt-1">Since {format(new Date(admin.since), 'MMMM yyyy')}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No administration staff found</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Facilities Tab */}
      {activeTab === 'facilities' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">School Facilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {school.facilities.length > 0 ? (
              school.facilities.map(facility => (
                <Card key={facility.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{facility.name}</h4>
                      <p className="text-sm text-gray-600">Count: {facility.count}</p>
                    </div>
                    <Badge className={
                      facility.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                      facility.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                      facility.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {facility.condition}
                    </Badge>
                  </div>
                  {facility.lastInspection && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last inspected: {format(new Date(facility.lastInspection), 'MMM d, yyyy')}
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-2 py-8">No facilities found</p>
            )}
          </div>
        </Card>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Documents</h3>
          <div className="space-y-4">
            {school.verification.documents.length > 0 ? (
              school.verification.documents.map(doc => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-xs text-gray-500">
                        Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {doc.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => window.open(doc.url)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No documents found</p>
            )}
          </div>
        </Card>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {school.recentActivity.length > 0 ? (
              school.recentActivity.map(activity => (
                <div key={activity.id} className="flex flex-col sm:flex-row items-start p-4 bg-gray-50 rounded-lg gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'inspection' ? 'bg-purple-100' :
                    activity.type === 'verification' ? 'bg-green-100' :
                    activity.type === 'report' ? 'bg-blue-100' :
                    'bg-red-100'
                  }`}>
                    {activity.type === 'inspection' && <Eye className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'verification' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.type === 'report' && <FileText className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'complaint' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <p className="font-medium">{activity.description}</p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(activity.date), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity found</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
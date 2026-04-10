// src/pages/ministry/Curriculum.tsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus,
  Eye, Download, Upload, CheckCircle,
  AlertCircle, FileText,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { Curriculum, CurriculumStats } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const MinistryCurriculum: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [stats, setStats] = useState<CurriculumStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  useEffect(() => {
    loadCurriculums();
  }, []);

  const loadCurriculums = async () => {
    try {
      const [curriculumsData, statsData] = await Promise.all([
        ministryAPI.getCurriculums(),
        ministryAPI.getCurriculumStats()
      ]);
      setCurriculums(curriculumsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load curriculums');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCurriculum = async (curriculumId: string) => {
    try {
      await ministryAPI.approveCurriculum(curriculumId);
      toast.success('Curriculum approved successfully');
      loadCurriculums();
    } catch (error) {
      toast.error('Failed to approve curriculum');
    }
  };

  const handleArchiveCurriculum = async (curriculumId: string) => {
    if (!window.confirm('Are you sure you want to archive this curriculum?')) return;
    
    try {
      await ministryAPI.archiveCurriculum(curriculumId);
      toast.success('Curriculum archived');
      loadCurriculums();
    } catch (error) {
      toast.error('Failed to archive curriculum');
    }
  };

  const handleExportCurriculum = async (curriculumId: string, curriculumName: string) => {
    try {
      const blob = await ministryAPI.exportCurriculum(curriculumId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${curriculumName.replace(/\s/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Curriculum exported successfully');
    } catch (error) {
      toast.error('Failed to export curriculum');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCurriculums = curriculums.filter(curriculum => {
    const matchesSearch = 
      curriculum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curriculum.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curriculum.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || curriculum.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || curriculum.grade === selectedGrade;
    
    return matchesSearch && matchesSubject && matchesGrade;
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">National Curriculum Framework</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Curriculum
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Curriculums</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">In Review</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.review}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-700">{stats.draft}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Subject */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Curriculums by Subject</h3>
          <div className="space-y-3">
            {stats.bySubject.map(item => (
              <div key={item.subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.subject}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(item.count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* By Grade */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Curriculums by Grade</h3>
          <div className="space-y-3">
            {stats.byGrade.map(item => (
              <div key={item.grade}>
                <div className="flex justify-between text-sm mb-1">
                  <span>Form {item.grade}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(item.count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, code, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Shona">Shona</option>
              <option value="Ndebele">Ndebele</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
        </div>
      </Card>

      {/* Curriculum List */}
      <div className="space-y-4">
        {filteredCurriculums.length > 0 ? (
          filteredCurriculums.map(curriculum => (
            <Card key={curriculum.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
                    <h3 className="text-lg font-semibold">{curriculum.name}</h3>
                    <Badge className="bg-blue-100 text-blue-800">{curriculum.code}</Badge>
                    <Badge className="bg-purple-100 text-purple-800">v{curriculum.version}</Badge>
                    <Badge className={getStatusColor(curriculum.status)}>
                      {curriculum.status}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-3">{curriculum.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-gray-500">Subject</p>
                      <p className="font-medium">{curriculum.subject}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Grade</p>
                      <p className="font-medium">Form {curriculum.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium capitalize">{curriculum.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valid From</p>
                      <p className="font-medium">{format(new Date(curriculum.validFrom), 'yyyy')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {curriculum.topics.slice(0, 3).map(topic => (
                      <Badge key={topic.id} className="bg-gray-100 text-gray-800">
                        {topic.title}
                      </Badge>
                    ))}
                    {curriculum.topics.length > 3 && (
                      <Badge className="bg-gray-100 text-gray-800">
                        +{curriculum.topics.length - 3} more topics
                      </Badge>
                    )}
                  </div>

                  {curriculum.approvedAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      Approved on {format(new Date(curriculum.approvedAt), 'MMMM d, yyyy')} by {curriculum.approvedBy}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportCurriculum(curriculum.id, curriculum.name)}
                    title="Export Curriculum"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {curriculum.status === 'review' && (
                    <Button
                      size="sm"
                      onClick={() => handleApproveCurriculum(curriculum.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {curriculum.status === 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleArchiveCurriculum(curriculum.id)}
                    >
                      Archive
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Curriculums Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedSubject !== 'all' || selectedGrade !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first curriculum to get started'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
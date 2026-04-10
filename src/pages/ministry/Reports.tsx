// src/pages/ministry/Reports.tsx
import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Eye, Calendar,
  Search, Plus, Clock,
  CheckCircle, Share2,
  TrendingUp, TrendingDown, Award
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { Report, ReportStats } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [reportParameters, setReportParameters] = useState({
    type: 'performance',
    period: 'quarterly',
    year: '2024',
    quarter: '1',
    month: 'January',
    regions: [] as string[],
    format: 'pdf'
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [reportsData, statsData] = await Promise.all([
        ministryAPI.getReports(),
        ministryAPI.getReportStats()
      ]);
      setReports(reportsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await ministryAPI.generateReport(reportParameters);
      toast.success('Report generation started');
      setShowGenerateModal(false);
      loadReports();
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      await ministryAPI.downloadReport(reportId);
      toast.success('Report downloaded');
      loadReports();
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handlePublishReport = async (reportId: string) => {
    try {
      await ministryAPI.publishReport(reportId);
      toast.success('Report published');
      loadReports();
    } catch (error) {
      toast.error('Failed to publish report');
    }
  };

  const handleScheduleReport = async (reportId: string) => {
    try {
      await ministryAPI.scheduleReport(reportId);
      toast.success('Report scheduled');
      loadReports();
    } catch (error) {
      toast.error('Failed to schedule report');
    }
  };

  const handleShareReport = async (reportId: string) => {
    try {
      await ministryAPI.shareReport(reportId);
      toast.success('Report shared via email');
    } catch (error) {
      toast.error('Failed to share report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'annual': return <Award className="w-4 h-4" />;
      case 'quarterly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <Clock className="w-4 h-4" />;
      case 'statistical': return <FileText className="w-4 h-4" />;
      case 'compliance': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    
    let matchesTab = true;
    if (activeTab === 'published') {
      matchesTab = report.status === 'published';
    } else if (activeTab === 'draft') {
      matchesTab = report.status === 'draft';
    } else if (activeTab === 'generated') {
      matchesTab = report.status === 'generated';
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesTab;
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
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <Button onClick={() => setShowGenerateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Published</p>
              <p className="text-2xl font-bold text-green-700">{stats.published}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Generated</p>
              <p className="text-2xl font-bold text-blue-700">{stats.generated}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
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
        <Card className="p-4 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Downloads</p>
              <p className="text-2xl font-bold text-purple-700">{stats.recentDownloads}</p>
            </div>
            <Download className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Popular Reports */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Most Downloaded Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.popularReports.map(report => (
            <Card key={report.id} className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-gray-500">{report.downloads} downloads</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search reports by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="annual">Annual Reports</option>
              <option value="quarterly">Quarterly Reports</option>
              <option value="monthly">Monthly Reports</option>
              <option value="statistical">Statistical Reports</option>
              <option value="compliance">Compliance Reports</option>
              <option value="special">Special Reports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="education">Education</option>
              <option value="financial">Financial</option>
              <option value="performance">Performance</option>
              <option value="enrollment">Enrollment</option>
              <option value="staff">Staff</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'published'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Published ({stats.published})
          </button>
          <button
            onClick={() => setActiveTab('generated')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generated'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generated ({stats.generated})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'draft'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Draft ({stats.draft})
          </button>
        </nav>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <Card key={report.id} className="p-6">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      report.type === 'annual' ? 'bg-purple-100' :
                      report.type === 'quarterly' ? 'bg-blue-100' :
                      report.type === 'monthly' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}>
                      {getTypeIcon(report.type)}
                    </div>
                    <h3 className="text-lg font-semibold">{report.title}</h3>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800 capitalize">
                      {report.type}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 uppercase">
                      {report.format}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-3">{report.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Period:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(report.period.startDate), 'MMM d, yyyy')} - {format(new Date(report.period.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created by:</span>
                      <span className="ml-2 font-medium">{report.createdBy.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Downloads:</span>
                      <span className="ml-2 font-medium">{report.downloadCount}</span>
                    </div>
                  </div>

                  {/* Metrics Preview */}
                  {report.metrics && report.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                      {report.metrics.slice(0, 4).map(metric => (
                        <div key={metric.name} className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-500">{metric.name}</p>
                          <div className="flex items-center">
                            <span className="text-lg font-bold">{metric.value}</span>
                            {metric.change && (
                              <div className="flex items-center ml-2">
                                {metric.trend === 'up' ? (
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                ) : metric.trend === 'down' ? (
                                  <TrendingDown className="w-3 h-3 text-red-500" />
                                ) : null}
                                <span className={`text-xs ml-1 ${
                                  metric.trend === 'up' ? 'text-green-600' :
                                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  {metric.change > 0 ? '+' : ''}{metric.change}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {report.tags.map(tag => (
                      <Badge key={tag} className="bg-gray-100 text-gray-800">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {report.scheduled && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center">
                      <Clock className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-blue-700">
                        Scheduled {report.scheduled.frequency} • Next run: {format(new Date(report.scheduled.nextRun), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShareReport(report.id)}
                    title="Share Report"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                    title="Download Report"
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
                  {report.status === 'generated' && (
                    <Button
                      size="sm"
                      onClick={() => handlePublishReport(report.id)}
                    >
                      Publish
                    </Button>
                  )}
                  {report.status === 'published' && !report.scheduled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScheduleReport(report.id)}
                    >
                      Schedule
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Generate your first report to get started'}
            </p>
          </Card>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Generate New Report</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Type</label>
                <select
                  value={reportParameters.type}
                  onChange={(e) => setReportParameters({ ...reportParameters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="performance">Performance Report</option>
                  <option value="enrollment">Enrollment Report</option>
                  <option value="financial">Financial Report</option>
                  <option value="compliance">Compliance Report</option>
                  <option value="staff">Staff Report</option>
                  <option value="infrastructure">Infrastructure Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  value={reportParameters.period}
                  onChange={(e) => setReportParameters({ ...reportParameters, period: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {reportParameters.period === 'quarterly' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={reportParameters.year}
                      onChange={(e) => setReportParameters({ ...reportParameters, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quarter</label>
                    <select
                      value={reportParameters.quarter}
                      onChange={(e) => setReportParameters({ ...reportParameters, quarter: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="1">Q1 (Jan-Mar)</option>
                      <option value="2">Q2 (Apr-Jun)</option>
                      <option value="3">Q3 (Jul-Sep)</option>
                      <option value="4">Q4 (Oct-Dec)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Format</label>
                <select
                  value={reportParameters.format}
                  onChange={(e) => setReportParameters({ ...reportParameters, format: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Regions (Optional)</label>
                <div className="border border-gray-300 rounded-md p-2 h-32 overflow-y-auto">
                  {['Harare', 'Bulawayo', 'Manicaland', 'Masvingo', 'Midlands', 'Mashonaland East', 'Mashonaland West', 'Matabeleland North', 'Matabeleland South'].map(region => (
                    <label key={region} className="flex items-center p-1 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        value={region.toLowerCase()}
                        checked={reportParameters.regions.includes(region.toLowerCase())}
                        onChange={(e) => {
                          const regions = e.target.checked
                            ? [...reportParameters.regions, region.toLowerCase()]
                            : reportParameters.regions.filter(r => r !== region.toLowerCase());
                          setReportParameters({ ...reportParameters, regions });
                        }}
                        className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">{region}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Select one or more regions</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowGenerateModal(false);
                    setReportParameters({
                      type: 'performance',
                      period: 'quarterly',
                      year: '2024',
                      quarter: '1',
                      month: 'January',
                      regions: [],
                      format: 'pdf'
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
// src/pages/ministry/Compliance.tsx
import React, { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle, XCircle,
  Clock, Download, Search,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { ComplianceItem, ComplianceStats } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const Compliance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      const [itemsData, statsData] = await Promise.all([
        ministryAPI.getComplianceItems(),
        ministryAPI.getComplianceStats()
      ]);
      setItems(itemsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInspection = async (itemId: string) => {
    try {
      await ministryAPI.scheduleInspection(itemId);
      toast.success('Inspection scheduled');
      loadComplianceData();
    } catch (error) {
      toast.error('Failed to schedule inspection');
    }
  };

  const handleIssueWarning = async (itemId: string) => {
    try {
      await ministryAPI.issueWarning(itemId);
      toast.success('Warning issued');
      loadComplianceData();
    } catch (error) {
      toast.error('Failed to issue warning');
    }
  };

  const handleExportReport = async () => {
    try {
      const blob = await ministryAPI.exportComplianceReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'waived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesEntity = selectedEntity === 'all' || item.entityType === selectedEntity;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesEntity;
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
        <h1 className="text-2xl font-bold">Compliance Monitoring</h1>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Overall Compliance</p>
          <p className="text-2xl font-bold text-primary-600">{stats.overall}%</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Compliant</p>
              <p className="text-2xl font-bold text-green-700">{stats.compliant}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Non-Compliant</p>
              <p className="text-2xl font-bold text-red-700">{stats.nonCompliant}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-700">{stats.expired}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance by Category</h3>
          <div className="space-y-4">
            {stats.byCategory.map(category => (
              <div key={category.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{category.category}</span>
                  <span className="font-medium">{category.compliant}/{category.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(category.compliant / category.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Compliance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Regional Compliance Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byRegion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="rate" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Compliance Issues</h3>
        <div className="space-y-3">
          {stats.recentIssues.length > 0 ? (
            stats.recentIssues.map(issue => (
              <div key={issue.id} className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{issue.entityName}</p>
                    <Badge className={
                      issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{issue.issue}</p>
                  <p className="text-xs text-gray-500 mt-1">{format(new Date(issue.date), 'MMM d, yyyy')}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent issues found</p>
          )}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by entity or requirement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="registration">Registration</option>
              <option value="certification">Certification</option>
              <option value="inspection">Inspection</option>
              <option value="documentation">Documentation</option>
              <option value="safety">Safety</option>
              <option value="curriculum">Curriculum</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="non-compliant">Non-Compliant</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity</label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Entities</option>
              <option value="school">Schools</option>
              <option value="teacher">Teachers</option>
              <option value="tutor">Tutors</option>
              <option value="program">Programs</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Compliance Items List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
                    <h3 className="font-semibold">{item.entityName}</h3>
                    <Badge className="bg-blue-100 text-blue-800 capitalize">
                      {item.entityType}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority} priority
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-2">{item.requirement}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium capitalize">{item.category}</span>
                    </div>
                    {item.lastChecked && (
                      <div>
                        <span className="text-gray-500">Last Checked:</span>
                        <span className="ml-2">{format(new Date(item.lastChecked), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    {item.dueDate && (
                      <div>
                        <span className="text-gray-500">Due:</span>
                        <span className={`ml-2 ${
                          new Date(item.dueDate) < new Date() ? 'text-red-600' : ''
                        }`}>
                          {format(new Date(item.dueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>

                  {item.findings && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Findings:</span> {item.findings}
                    </p>
                  )}

                  {item.actions && item.actions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Required Actions:</p>
                      <div className="space-y-2">
                        {item.actions.map(action => (
                          <div key={action.id} className="flex items-center text-sm">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              action.status === 'completed' ? 'bg-green-500' :
                              action.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <span className="flex-1">{action.description}</span>
                            <span className="text-gray-500 text-xs">
                              Due: {format(new Date(action.deadline), 'MMM d')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {item.status === 'non-compliant' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleIssueWarning(item.id)}
                    >
                      Issue Warning
                    </Button>
                  )}
                  {item.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleScheduleInspection(item.id)}
                    >
                      Schedule Inspection
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Compliance Items Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedEntity !== 'all'
                ? 'Try adjusting your filters'
                : 'No compliance items available'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
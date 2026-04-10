// src/pages/ministry/Policies.tsx
import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Eye,
  Download, Upload, CheckCircle,
  Clock, Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { Policy, PolicyStats } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Policies: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [stats, setStats] = useState<PolicyStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const [policiesData, statsData] = await Promise.all([
        ministryAPI.getPolicies(),
        ministryAPI.getPolicyStats()
      ]);
      setPolicies(policiesData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePolicy = async (policyId: string) => {
    try {
      await ministryAPI.approvePolicy(policyId);
      toast.success('Policy approved successfully');
      loadPolicies();
    } catch (error) {
      toast.error('Failed to approve policy');
    }
  };

  const handleArchivePolicy = async (policyId: string) => {
    if (!window.confirm('Are you sure you want to archive this policy?')) return;
    
    try {
      await ministryAPI.archivePolicy(policyId);
      toast.success('Policy archived');
      loadPolicies();
    } catch (error) {
      toast.error('Failed to archive policy');
    }
  };

  const handlePublishPolicy = async (policyId: string) => {
    try {
      await ministryAPI.publishPolicy(policyId);
      toast.success('Policy published');
      loadPolicies();
    } catch (error) {
      toast.error('Failed to publish policy');
    }
  };

  const handleDownloadPolicy = async (policyId: string, policyTitle: string) => {
    try {
      const blob = await ministryAPI.downloadPolicy(policyId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${policyTitle.replace(/\s/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Policy downloaded successfully');
    } catch (error) {
      toast.error('Failed to download policy');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      case 'replaced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || policy.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    
    let matchesTab = true;
    if (activeTab === 'active') {
      matchesTab = policy.status === 'active';
    } else if (activeTab === 'draft') {
      matchesTab = policy.status === 'draft';
    } else if (activeTab === 'review') {
      matchesTab = policy.status === 'review';
    } else if (activeTab === 'archived') {
      matchesTab = policy.status === 'archived';
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
        <h1 className="text-2xl font-bold">Education Policies & Regulations</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Policies</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
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
            <Clock className="w-8 h-8 text-yellow-500" />
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
        {/* By Type */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Policies by Type</h3>
          <div className="space-y-3">
            {stats.byType.map(item => (
              <div key={item.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{item.type}</span>
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

        {/* By Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Policies by Category</h3>
          <div className="space-y-3">
            {stats.byCategory.map(item => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{item.category}</span>
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

      {/* Recent Updates */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Policy Updates</h3>
        <div className="space-y-3">
          {stats.recentUpdates.map(update => (
            <div key={update.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{update.title}</p>
                <p className="text-sm text-gray-500 capitalize">{update.type}</p>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <p className="text-sm text-gray-600">
                  Updated {format(new Date(update.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title, reference, or description..."
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
              <option value="education">Education</option>
              <option value="administration">Administration</option>
              <option value="finance">Finance</option>
              <option value="personnel">Personnel</option>
              <option value="student">Student</option>
              <option value="safety">Safety</option>
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
              <option value="act">Acts</option>
              <option value="regulation">Regulations</option>
              <option value="guideline">Guidelines</option>
              <option value="circular">Circulars</option>
              <option value="directive">Directives</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'review'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            In Review ({stats.review})
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
          <button
            onClick={() => setActiveTab('archived')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'archived'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Archived
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Policies
          </button>
        </nav>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {filteredPolicies.length > 0 ? (
          filteredPolicies.map(policy => (
            <Card key={policy.id} className="p-6">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{policy.title}</h3>
                    <Badge className="bg-gray-100 text-gray-800">{policy.reference}</Badge>
                    <Badge className="bg-blue-100 text-blue-800 capitalize">{policy.type}</Badge>
                    <Badge className="bg-purple-100 text-purple-800 capitalize">{policy.category}</Badge>
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">v{policy.version}</Badge>
                  </div>

                  <p className="text-gray-600 mb-3">{policy.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Effective Date:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(policy.effectiveDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {policy.reviewDate && (
                      <div>
                        <span className="text-gray-500">Review Date:</span>
                        <span className="ml-2 font-medium">
                          {format(new Date(policy.reviewDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Approved by:</span>
                      <span className="ml-2 font-medium">{policy.approvedBy.name}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {policy.tags.map(tag => (
                      <Badge key={tag} className="bg-gray-100 text-gray-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{policy.statistics.views} views</span>
                    <span>•</span>
                    <span>{policy.statistics.downloads} downloads</span>
                    <span>•</span>
                    <span>
                      Compliance: {policy.statistics.compliantEntities}/{policy.statistics.totalEntities}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadPolicy(policy.id, policy.title)}
                    title="Download Policy"
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
                  {policy.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handlePublishPolicy(policy.id)}
                    >
                      Publish
                    </Button>
                  )}
                  {policy.status === 'review' && (
                    <Button
                      size="sm"
                      onClick={() => handleApprovePolicy(policy.id)}
                    >
                      Approve
                    </Button>
                  )}
                  {policy.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleArchivePolicy(policy.id)}
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
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Policies Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first policy to get started'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
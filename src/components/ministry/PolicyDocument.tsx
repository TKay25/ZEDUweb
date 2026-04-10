// frontend/src/components/ministry/PolicyDocument.tsx
import React, { useState } from 'react';
import {
  FileText, Download, Eye, Edit, Trash2,
  Plus, Search, Calendar,
  User, Tag, CheckCircle
} from 'lucide-react';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { toast } from 'react-hot-toast';

interface PolicyDocument {
  id: string;
  title: string;
  reference: string;
  type: 'act' | 'regulation' | 'policy' | 'guideline' | 'circular';
  category: 'education' | 'finance' | 'administration' | 'curriculum' | 'exams';
  status: 'draft' | 'published' | 'archived' | 'replaced';
  version: string;
  content: string;
  summary: string;
  keywords: string[];
  effectiveDate: Date;
  reviewDate: Date;
  publishedDate?: Date;
  lastUpdated: Date;
  author: string;
  department: string;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  relatedPolicies?: string[];
  tags: string[];
}

interface PolicyDocumentProps {
  documents: PolicyDocument[];
  onCreatePolicy: () => void;
  onViewPolicy: (policyId: string) => void;
  onEditPolicy: (policyId: string) => void;
  onDeletePolicy: (policyId: string) => void;
  onDownloadPolicy: (policyId: string) => void;
  onPublishPolicy: (policyId: string) => Promise<void>;
  onArchivePolicy: (policyId: string) => Promise<void>;
  onSearchPolicies: (query: string) => void;
}

// Define Badge variant type that matches the Badge component
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'default';

// Define options for Select components
const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'act', label: 'Acts' },
  { value: 'regulation', label: 'Regulations' },
  { value: 'policy', label: 'Policies' },
  { value: 'guideline', label: 'Guidelines' },
  { value: 'circular', label: 'Circulars' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'administration', label: 'Administration' },
  { value: 'curriculum', label: 'Curriculum' },
  { value: 'exams', label: 'Exams' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
  { value: 'replaced', label: 'Replaced' },
];

export const PolicyDocument: React.FC<PolicyDocumentProps> = ({
  documents,
  onCreatePolicy,
  onViewPolicy,
  onEditPolicy,
  onDeletePolicy,
  onDownloadPolicy,
  onPublishPolicy,
  onArchivePolicy: _onArchivePolicy,
  onSearchPolicies
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'act': return <FileText className="w-4 h-4 text-red-500" />;
      case 'regulation': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'policy': return <FileText className="w-4 h-4 text-green-500" />;
      case 'guideline': return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'circular': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      case 'replaced': return 'info';
      default: return 'default';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handlePublish = async (policyId: string) => {
    try {
      await onPublishPolicy(policyId);
      toast.success('Policy published successfully');
    } catch (_error) {
      toast.error('Failed to publish policy');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchPolicies(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Education Policies & Regulations</h1>
        <Button variant="primary" onClick={onCreatePolicy}>
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Documents</p>
          <p className="text-2xl font-bold">{documents.length}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-700">Published</p>
          <p className="text-2xl font-bold text-green-700">
            {documents.filter(d => d.status === 'published').length}
          </p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">Draft</p>
          <p className="text-2xl font-bold text-yellow-700">
            {documents.filter(d => d.status === 'draft').length}
          </p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-blue-700">Under Review</p>
          <p className="text-2xl font-bold text-blue-700">
            {documents.filter(d => d.status === 'draft').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <Select
            label="Type"
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
            options={TYPE_OPTIONS}
          />
          
          <Select
            label="Category"
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
          
          <Select
            label="Status"
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>
      </Card>

      {/* View Toggle */}
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </Button>
        <Button
          variant={viewMode === 'list' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          List View
        </Button>
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {getTypeIcon(doc.type)}
                  <Badge variant={getStatusVariant(doc.status)} className="ml-2">
                    {doc.status}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">v{doc.version}</span>
              </div>

              <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.summary}</p>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Ref: {doc.reference}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Effective: {new Date(doc.effectiveDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{doc.author}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {doc.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
                {doc.tags.length > 3 && (
                  <Badge variant="default" size="sm">
                    +{doc.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onViewPolicy(doc.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDownloadPolicy(doc.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditPolicy(doc.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {doc.status === 'draft' && (
                <div className="mt-3 flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePublish(doc.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEditPolicy(doc.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                    {getTypeIcon(doc.type)}
                    <h3 className="font-semibold">{doc.title}</h3>
                    <Badge variant={getStatusVariant(doc.status)}>
                      {doc.status}
                    </Badge>
                    <span className="text-xs text-gray-500">v{doc.version}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{doc.summary}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <span>Ref: {doc.reference}</span>
                    <span>•</span>
                    <span>Effective: {new Date(doc.effectiveDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Review: {new Date(doc.reviewDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>By: {doc.author}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {doc.tags.map((tag, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onViewPolicy(doc.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDownloadPolicy(doc.id)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEditPolicy(doc.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeletePolicy(doc.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <Button variant="primary" className="mt-4" onClick={onCreatePolicy}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Policy
          </Button>
        </Card>
      )}
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Video,
  FileText,
  Image,
  Link as LinkIcon,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Move,
  Copy,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Grid,
  List,
  FolderOpen,
  File,
  Headphones,
  Presentation,
  RefreshCw,
  Loader,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../hooks/useToast';
import axios from 'axios';

// Define interfaces
interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'presentation' | 'audio' | 'image' | 'link' | 'other';
  description: string;
  duration?: number;
  fileSize?: number;
  fileUrl?: string;
  thumbnail?: string;
  order: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  views: number;
  completions: number;
  tags: string[];
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  metadata?: {
    videoUrl?: string;
    duration?: number;
    pages?: number;
    questions?: number;
    passingScore?: number;
  };
}

interface ContentSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  items: ContentItem[];
  collapsed?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  sections: ContentSection[];
  totalItems: number;
  totalDuration: number;
  lastUpdated: Date;
  status: 'published' | 'draft' | 'archived';
}

interface ContentStats {
  totalItems: number;
  publishedItems: number;
  draftItems: number;
  totalViews: number;
  totalCompletions: number;
  averageCompletionRate: number;
}

// Simple Modal Component
const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Simple Input Component
const Input: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, placeholder, type = 'text' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  );
};

// Simple Textarea Component
const Textarea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}> = ({ value, onChange, placeholder, rows = 3 }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  );
};

export const Content: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [stats, setStats] = useState<ContentStats>({
    totalItems: 0,
    publishedItems: 0,
    draftItems: 0,
    totalViews: 0,
    totalCompletions: 0,
    averageCompletionRate: 0
  });

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fix for showToast - handle different possible signatures
  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    if (showToast) {
      try {
        // Try to call showToast with an object (common pattern)
        showToast({ message, type });
      } catch (e1) {
        try {
          // Try with two parameters (message, type)
          (showToast as any)(message, type);
        } catch (e2) {
          // Try with just message
          (showToast as any)(message);
        }
      }
    } else {
      console.log(`${type}: ${message}`);
    }
  };

  // Load course content with error handling
  const loadCourseContent = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/tutor/courses/${courseId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const courseData = response.data;
      setCourse(courseData);

      // Initialize expanded sections
      const expanded: Record<string, boolean> = {};
      courseData.sections.forEach((section: ContentSection) => {
        expanded[section.id] = true;
      });
      setExpandedSections(expanded);

      // Calculate stats
      const allItems = courseData.sections.flatMap((s: ContentSection) => s.items);
      const publishedItems = allItems.filter((i: ContentItem) => i.status === 'published').length;
      const draftItems = allItems.filter((i: ContentItem) => i.status === 'draft').length;
      const totalViews = allItems.reduce((sum: number, i: ContentItem) => sum + i.views, 0);
      const totalCompletions = allItems.reduce((sum: number, i: ContentItem) => sum + i.completions, 0);
      const avgCompletionRate = totalViews > 0 
        ? Math.round((totalCompletions / totalViews) * 100) 
        : 0;

      setStats({
        totalItems: allItems.length,
        publishedItems,
        draftItems,
        totalViews,
        totalCompletions,
        averageCompletionRate: avgCompletionRate
      });

    } catch (error: any) {
      console.error('Failed to load course content:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load course content';
      showToastMessage(errorMessage, 'error');
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate, API_BASE_URL]);

  useEffect(() => {
    if (courseId) {
      loadCourseContent();
    }
  }, [courseId, loadCourseContent]);

  // Auto-save functionality
  const autoSaveCourse = useCallback(async () => {
    if (!course || saving) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_BASE_URL}/tutor/courses/${courseId}/content`, 
        { sections: course.sections },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showToastMessage('Changes saved automatically', 'success');
    } catch (error) {
      console.error('Auto-save failed:', error);
      showToastMessage('Failed to auto-save changes', 'error');
    } finally {
      setSaving(false);
    }
  }, [course, courseId, saving, API_BASE_URL]);

  // Debounced auto-save
  useEffect(() => {
    if (!course) return;
    
    const timer = setTimeout(() => {
      autoSaveCourse();
    }, 3000);

    return () => clearTimeout(timer);
  }, [course, autoSaveCourse]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleAddSection = async () => {
    if (!course) return;

    const newSection: ContentSection = {
      id: `temp_${Date.now()}`,
      title: newSectionTitle,
      description: newSectionDescription,
      order: course.sections.length + 1,
      items: []
    };

    const updatedCourse = {
      ...course,
      sections: [...course.sections, newSection]
    };
    
    setCourse(updatedCourse);
    setExpandedSections(prev => ({
      ...prev,
      [newSection.id]: true
    }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/tutor/courses/${courseId}/sections`,
        { title: newSectionTitle, description: newSectionDescription, order: newSection.order },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const savedSection = response.data;
      const finalCourse = {
        ...updatedCourse,
        sections: updatedCourse.sections.map(s => 
          s.id === newSection.id ? { ...s, id: savedSection.id } : s
        )
      };
      setCourse(finalCourse);
      showToastMessage('Section added successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to add section', 'error');
      setCourse(course);
    }

    setNewSectionTitle('');
    setNewSectionDescription('');
    setShowAddSectionModal(false);
  };

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section);
    setNewSectionTitle(section.title);
    setNewSectionDescription(section.description || '');
    setShowAddSectionModal(true);
  };

  const handleUpdateSection = async () => {
    if (!course || !editingSection) return;

    const updatedSections = course.sections.map(s => 
      s.id === editingSection.id
        ? { ...s, title: newSectionTitle, description: newSectionDescription }
        : s
    );

    setCourse({ ...course, sections: updatedSections });

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/tutor/courses/${courseId}/sections/${editingSection.id}`,
        { title: newSectionTitle, description: newSectionDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToastMessage('Section updated successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to update section', 'error');
      loadCourseContent();
    }

    setEditingSection(null);
    setNewSectionTitle('');
    setNewSectionDescription('');
    setShowAddSectionModal(false);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!course) return;

    const updatedSections = course.sections
      .filter(s => s.id !== sectionId)
      .map((s, index) => ({ ...s, order: index + 1 }));

    setCourse({ ...course, sections: updatedSections });

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/tutor/courses/${courseId}/sections/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToastMessage('Section deleted successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to delete section', 'error');
      loadCourseContent();
    }
  };

  const handleMoveSection = async (sectionId: string, direction: 'up' | 'down') => {
    if (!course) return;

    const index = course.sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === course.sections.length - 1)
    ) return;

    const newSections = [...course.sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    
    newSections.forEach((s, i) => { s.order = i + 1; });

    setCourse({ ...course, sections: newSections });

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/tutor/courses/${courseId}/sections/reorder`,
        { sections: newSections.map(s => ({ id: s.id, order: s.order })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToastMessage('Section moved successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to move section', 'error');
      loadCourseContent();
    }
  };

  // Simple drag and drop using HTML5
  const handleDragStart = (e: React.DragEvent, type: string, id: string, sectionId?: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, id, sectionId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetSectionId: string, targetIndex?: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (!course) return;

    if (data.type === 'section') {
      // Handle section drop
      const sourceIndex = course.sections.findIndex(s => s.id === data.id);
      const targetIndex_num = course.sections.findIndex(s => s.id === targetSectionId);
      
      if (sourceIndex === -1 || targetIndex_num === -1) return;
      
      const newSections = [...course.sections];
      const [removed] = newSections.splice(sourceIndex, 1);
      newSections.splice(targetIndex_num, 0, removed);
      newSections.forEach((s, i) => { s.order = i + 1; });
      
      setCourse({ ...course, sections: newSections });
      
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `${API_BASE_URL}/tutor/courses/${courseId}/sections/reorder`,
          { sections: newSections.map(s => ({ id: s.id, order: s.order })) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToastMessage('Section reordered successfully', 'success');
      } catch (error) {
        showToastMessage('Failed to reorder sections', 'error');
        loadCourseContent();
      }
    } else if (data.type === 'item') {
      // Handle item drop
      const sourceSection = course.sections.find(s => s.id === data.sectionId);
      const targetSection = course.sections.find(s => s.id === targetSectionId);
      
      if (!sourceSection || !targetSection) return;
      
      const sourceItems = [...sourceSection.items];
      const sourceIndex = sourceItems.findIndex(i => i.id === data.id);
      if (sourceIndex === -1) return;
      
      const [removedItem] = sourceItems.splice(sourceIndex, 1);
      
      let targetItems = [...targetSection.items];
      const targetIndex_num = targetIndex !== undefined ? targetIndex : targetItems.length;
      targetItems.splice(targetIndex_num, 0, removedItem);
      
      targetItems = targetItems.map((item, idx) => ({ ...item, order: idx + 1 }));
      
      const updatedSections = course.sections.map(s => {
        if (s.id === data.sectionId) {
          return { ...s, items: sourceItems.map((item, idx) => ({ ...item, order: idx + 1 })) };
        }
        if (s.id === targetSectionId) {
          return { ...s, items: targetItems };
        }
        return s;
      });
      
      setCourse({ ...course, sections: updatedSections });
      
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `${API_BASE_URL}/tutor/courses/${courseId}/items/${data.id}/move`,
          {
            sourceSectionId: data.sectionId,
            targetSectionId: targetSectionId,
            newOrder: targetIndex_num
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToastMessage('Item moved successfully', 'success');
      } catch (error) {
        showToastMessage('Failed to move item', 'error');
        loadCourseContent();
      }
    }
  };

  const handleAddItem = (sectionId: string) => {
    navigate(`/tutor/courses/${courseId}/content/add?section=${sectionId}`);
  };

  const handleEditItem = (item: ContentItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    if (!course) return;

    const updatedSections = course.sections.map(section => {
      if (section.id === sectionId) {
        const updatedItems = section.items
          .filter(i => i.id !== itemId)
          .map((i, index) => ({ ...i, order: index + 1 }));
        return { ...section, items: updatedItems };
      }
      return section;
    });

    setCourse({ ...course, sections: updatedSections });
    setShowDeleteModal(false);
    setSelectedItem(null);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/tutor/courses/${courseId}/items/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToastMessage('Item deleted successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to delete item', 'error');
      loadCourseContent();
    }
  };

  const handleMoveItem = async (sectionId: string, itemId: string, direction: 'up' | 'down') => {
    if (!course) return;

    const section = course.sections.find(s => s.id === sectionId);
    if (!section) return;

    const index = section.items.findIndex(i => i.id === itemId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === section.items.length - 1)
    ) return;

    const newItems = [...section.items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    
    newItems.forEach((i, idx) => { i.order = idx + 1; });

    const updatedSections = course.sections.map(s => 
      s.id === sectionId ? { ...s, items: newItems } : s
    );

    setCourse({ ...course, sections: updatedSections });

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/tutor/courses/${courseId}/items/${itemId}/reorder`,
        { newOrder: swapIndex + 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToastMessage('Item moved successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to move item', 'error');
      loadCourseContent();
    }
  };

  const handleDuplicateItem = async (sectionId: string, item: ContentItem) => {
    if (!course) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/tutor/courses/${courseId}/items/${item.id}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newItem = response.data;
      const updatedSections = course.sections.map(section => {
        if (section.id === sectionId) {
          const updatedItems = [...section.items, newItem]
            .sort((a, b) => a.order - b.order);
          return { ...section, items: updatedItems };
        }
        return section;
      });

      setCourse({ ...course, sections: updatedSections });
      showToastMessage('Item duplicated successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to duplicate item', 'error');
    }
  };

  const handleBulkPublish = async () => {
    if (!course) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/tutor/courses/${courseId}/content/bulk-publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showToastMessage('All items published successfully', 'success');
      loadCourseContent();
    } catch (error) {
      showToastMessage('Failed to publish items', 'error');
    }
  };

  const getItemIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'document': return <FileText className="w-5 h-5 text-green-500" />;
      case 'quiz': return <CheckCircle className="w-5 h-5 text-yellow-500" />;
      case 'assignment': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'presentation': return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'audio': return <Headphones className="w-5 h-5 text-indigo-500" />;
      case 'image': return <Image className="w-5 h-5 text-pink-500" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-cyan-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  };

  const filteredSections = course?.sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
  })).filter(section => section.items.length > 0 || searchTerm === '') || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/tutor/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Auto-save indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link to="/tutor/courses" className="hover:text-primary-600">Courses</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/tutor/courses/${courseId}`} className="hover:text-primary-600">{course.title}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Content</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Course Content</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your course materials for ZEDU Platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={loadCourseContent}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleBulkPublish}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Publish
          </Button>
          <Button onClick={() => setShowAddSectionModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.publishedItems}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.draftItems}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Completions</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalCompletions.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-2xl font-bold text-primary-600">{stats.averageCompletionRate}%</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="quiz">Quizzes</option>
              <option value="assignment">Assignments</option>
              <option value="presentation">Presentations</option>
              <option value="audio">Audio</option>
              <option value="image">Images</option>
              <option value="link">Links</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
              />
            </div>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-primary-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-primary-600' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections with Drag and Drop using HTML5 */}
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, 'section', section.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, section.id)}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white cursor-move"
            >
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Move className="w-5 h-5 text-gray-400" />
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {expandedSections[section.id] ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-gray-500">{section.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                    </Badge>
                    <button
                      onClick={() => handleMoveSection(section.id, 'up')}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(section.id, 'down')}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Edit Section"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this section? This will delete all items in it.')) {
                          handleDeleteSection(section.id);
                        }
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <Button
                      size="sm"
                      onClick={() => handleAddItem(section.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>

              {/* Section Items */}
              {expandedSections[section.id] && (
                <div 
                  className="p-6"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, section.id)}
                >
                  {section.items.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2">No items in this section</p>
                      <Button
                        size="sm"
                        onClick={() => handleAddItem(section.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Item
                      </Button>
                    </div>
                  ) : viewMode === 'list' ? (
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, 'item', item.id, section.id)}
                          onDragOver={handleDragOver}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-move"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            {getItemIcon(item.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Link
                                  to={`/tutor/courses/${courseId}/content/${item.id}`}
                                  className="font-medium hover:text-primary-600"
                                >
                                  {item.title}
                                </Link>
                                {item.status === 'draft' && (
                                  <Badge variant="secondary" size="sm" className="bg-yellow-100 text-yellow-800">
                                    Draft
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDuration(item.duration)}
                                </span>
                                {item.fileSize && (
                                  <span>{formatFileSize(item.fileSize)}</span>
                                )}
                                <span>{item.views.toLocaleString()} views</span>
                                <span>{item.completions} completions</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleMoveItem(section.id, item.id, 'up')}
                              className="p-1 hover:bg-white rounded"
                            >
                              <ArrowUp className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleMoveItem(section.id, item.id, 'down')}
                              className="p-1 hover:bg-white rounded"
                            >
                              <ArrowDown className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDuplicateItem(section.id, item)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Copy className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, 'item', item.id, section.id)}
                          onDragOver={handleDragOver}
                          className="cursor-move"
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            {item.thumbnail && (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-32 object-cover rounded-t-lg"
                              />
                            )}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {getItemIcon(item.type)}
                                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                                </div>
                                {item.status === 'draft' && (
                                  <Badge variant="secondary" size="sm" className="bg-yellow-100 text-yellow-800">
                                    Draft
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDuration(item.duration)}
                                </span>
                                <span>{item.views} views</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(`/preview/${courseId}/${item.id}`, '_blank')}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first section'}
              </p>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                <Button onClick={() => setShowAddSectionModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Section Modal */}
      {showAddSectionModal && (
        <Modal
          title={editingSection ? 'Edit Section' : 'Add New Section'}
          onClose={() => {
            setShowAddSectionModal(false);
            setEditingSection(null);
            setNewSectionTitle('');
            setNewSectionDescription('');
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Title
              </label>
              <Input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="e.g., Introduction to Calculus"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <Textarea
                value={newSectionDescription}
                onChange={(e) => setNewSectionDescription(e.target.value)}
                placeholder="Brief description of this section"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddSectionModal(false);
                  setEditingSection(null);
                  setNewSectionTitle('');
                  setNewSectionDescription('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingSection ? handleUpdateSection : handleAddSection}
                disabled={!newSectionTitle.trim()}
              >
                {editingSection ? 'Update Section' : 'Add Section'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Item Details Modal */}
      {showItemModal && selectedItem && (
        <Modal
          title="Item Details"
          onClose={() => {
            setShowItemModal(false);
            setSelectedItem(null);
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getItemIcon(selectedItem.type)}
              <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{selectedItem.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{selectedItem.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{formatDuration(selectedItem.duration)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Views</p>
                <p className="font-medium">{selectedItem.views.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{new Date(selectedItem.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{selectedItem.description}</p>
            </div>

            {selectedItem.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map(tag => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedItem.attachments && selectedItem.attachments.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Attachments</p>
                <div className="space-y-2">
                  {selectedItem.attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <File className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{att.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(att.size)})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(att.url, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowItemModal(false);
                  setSelectedItem(null);
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowItemModal(false);
                  navigate(`/tutor/courses/${courseId}/content/${selectedItem.id}/edit`);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Item
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <Modal
          title="Delete Item"
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
        >
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-6">
              You are about to delete "{selectedItem.title}". This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedItem(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  const section = course?.sections.find(s => 
                    s.items.some(i => i.id === selectedItem.id)
                  );
                  if (section) {
                    handleDeleteItem(section.id, selectedItem.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Item
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Content;
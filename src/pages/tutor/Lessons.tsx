// Lessons.tsx
import React, { useState, useEffect } from 'react';
import {
  Plus, Video, FileText, Edit, Trash2,
  Eye, ChevronUp, ChevronDown, Clock,
  FolderOpen, Download, Link as LinkIcon
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: number;
  order: number;
  status: 'draft' | 'published';
  isCompleted?: boolean;
}

interface ContentItem {
  id: string;
  name: string;
  type: 'video' | 'document' | 'image' | 'link';
  url: string;
  size?: number;
  uploadedAt: Date;
  folder?: string;
}

// Simple Drag and Drop without react-beautiful-dnd to avoid type issues
export const Lessons: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/courses/${courseId}/lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessons(response.data.lessons);
      setCourseTitle(response.data.courseTitle);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      toast.error('Failed to load lessons');
      // Set mock data for demo
      setMockData();
    }
  };

  const setMockData = () => {
    setCourseTitle('Sample Course');
    setLessons([
      {
        id: '1',
        title: 'Introduction to the Course',
        type: 'video',
        duration: 15,
        order: 1,
        status: 'published'
      },
      {
        id: '2',
        title: 'Getting Started Guide',
        type: 'text',
        duration: 10,
        order: 2,
        status: 'published'
      },
      {
        id: '3',
        title: 'Knowledge Check Quiz',
        type: 'quiz',
        duration: 20,
        order: 3,
        status: 'draft'
      }
    ]);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex) return;

    const newLessons = [...lessons];
    const [removed] = newLessons.splice(draggedItem, 1);
    newLessons.splice(targetIndex, 0, removed);

    // Update order numbers
    const updatedLessons = newLessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1
    }));

    setLessons(updatedLessons);
    setDraggedItem(null);

    // Save new order to API
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/tutor/courses/${courseId}/lessons/reorder`, 
        { lessonIds: updatedLessons.map(l => l.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Lesson order updated');
    } catch (error) {
      console.error('Failed to save lesson order:', error);
      toast.error('Failed to save lesson order');
      fetchLessons(); // Revert on error
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/tutor/courses/${courseId}/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLessons(lessons.filter(l => l.id !== lessonId));
        toast.success('Lesson deleted successfully');
      } catch (error) {
        console.error('Failed to delete lesson:', error);
        toast.error('Failed to delete lesson');
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'text': return <FileText className="w-5 h-5 text-green-500" />;
      case 'quiz': return <FileText className="w-5 h-5 text-yellow-500" />;
      case 'assignment': return <FileText className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{courseTitle}</h1>
          <p className="text-gray-600 mt-1">Manage course lessons and content</p>
        </div>
        <Button onClick={() => navigate(`/tutor/courses/${courseId}/lessons/create`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {/* Lessons List */}
      <Card className="p-6">
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-move"
            >
              <div className="mr-3 cursor-grab">
                <ChevronUp className="w-4 h-4 text-gray-400" />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <div className="mr-3">
                {getTypeIcon(lesson.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="font-medium">{lesson.title}</h3>
                  {lesson.status === 'draft' && (
                    <Badge size="sm" className="bg-gray-200 text-gray-700">
                      Draft
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {lesson.duration} min
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/tutor/courses/${courseId}/lessons/${lesson.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/tutor/courses/${courseId}/lessons/${lesson.id}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteLesson(lesson.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {lessons.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Lessons Yet</h3>
              <p className="text-gray-500 mb-4">
                Start creating lessons for your course
              </p>
              <Button onClick={() => navigate(`/tutor/courses/${courseId}/lessons/create`)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Lesson
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Content Component
export const CourseContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchContent();
  }, [courseId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/courses/${courseId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent(response.data.items);
      setFolders(response.data.folders);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast.error('Failed to load content');
      // Set mock data
      setMockContentData();
    } finally {
      setLoading(false);
    }
  };

  const setMockContentData = () => {
    setFolders(['Videos', 'Documents', 'Images']);
    setContent([
      {
        id: '1',
        name: 'introduction-video.mp4',
        type: 'video',
        url: '#',
        size: 25000000,
        uploadedAt: new Date(),
        folder: 'Videos'
      },
      {
        id: '2',
        name: 'course-guide.pdf',
        type: 'document',
        url: '#',
        size: 5000000,
        uploadedAt: new Date(),
        folder: 'Documents'
      },
      {
        id: '3',
        name: 'course-thumbnail.jpg',
        type: 'image',
        url: '#',
        size: 2000000,
        uploadedAt: new Date(),
        folder: 'Images'
      },
      {
        id: '4',
        name: 'https://example.com/resources',
        type: 'link',
        url: 'https://example.com/resources',
        size: 0,
        uploadedAt: new Date(),
        folder: 'Documents'
      }
    ]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/tutor/courses/${courseId}/content/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Files uploaded successfully');
      fetchContent();
    } catch (error) {
      console.error('Failed to upload files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/tutor/courses/${courseId}/content/${contentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContent(content.filter(c => c.id !== contentId));
        toast.success('File deleted successfully');
      } catch (error) {
        console.error('Failed to delete file:', error);
        toast.error('Failed to delete file');
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'document': return <FileText className="w-5 h-5 text-green-500" />;
      case 'image': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredContent = selectedFolder === 'all' 
    ? content 
    : content.filter(c => c.folder === selectedFolder);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Course Content</h1>
          <p className="text-gray-600 mt-1">Manage your course files and resources</p>
        </div>
        <div>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              disabled={uploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Plus className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </label>
        </div>
      </div>

      {/* Folders */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFolder === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFolder('all')}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            All Files
          </Button>
          {folders.map((folder) => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              {folder}
            </Button>
          ))}
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContent.map((item) => (
          <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="mr-3">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {item.type === 'link' ? 'External Link' : formatFileSize(item.size)} • Uploaded {new Date(item.uploadedAt).toLocaleDateString()}
                </p>
                {item.type === 'link' && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline truncate block"
                  >
                    {item.url}
                  </a>
                )}
              </div>
              <div className="flex space-x-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-primary-600"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDeleteContent(item.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card className="p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Content Yet</h3>
          <p className="text-gray-500">
            Upload files to use in your course lessons
          </p>
        </Card>
      )}
    </div>
  );
};

export default Lessons;
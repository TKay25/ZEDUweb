import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Save, Video, FileText, 
  Eye, EyeOff, Trash2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';
import { toast } from 'react-hot-toast';

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

// Type declaration for react-quill
// If you continue to get the type error, create a declaration file
// or add: declare module 'react-quill';

interface LessonEditorProps {
  lesson?: {
    id?: string;
    title: string;
    content: string;
    type: 'video' | 'text' | 'quiz' | 'assignment';
    duration: number;
    videoUrl?: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
    resources?: Array<{
      title: string;
      url: string;
      type: 'link' | 'file' | 'embed';
    }>;
    isPublished: boolean;
    order: number;
  };
  onSave: (lessonData: any) => Promise<void>;
  onCancel: () => void;
}

// Options for selects
const lessonTypeOptions = [
  { value: 'video', label: 'Video Lesson' },
  { value: 'text', label: 'Text Lesson' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' }
];

const resourceTypeOptions = [
  { value: 'link', label: 'Link' },
  { value: 'file', label: 'File' },
  { value: 'embed', label: 'Embed' }
];

// Tabs configuration
const tabs = [
  { key: 'content', label: 'Content' },
  { key: 'media', label: 'Media' },
  { key: 'resources', label: 'Resources' },
  { key: 'settings', label: 'Settings' }
];

export const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  onSave,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [lessonData, setLessonData] = useState({
    title: lesson?.title || '',
    content: lesson?.content || '',
    type: lesson?.type || 'video',
    duration: lesson?.duration || 0,
    videoUrl: lesson?.videoUrl || '',
    attachments: lesson?.attachments || [],
    resources: lesson?.resources || [],
    isPublished: lesson?.isPublished || false,
    order: lesson?.order || 1
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(
    lesson?.videoUrl || null
  );

  const handleContentChange = (content: string) => {
    setLessonData(prev => ({ ...prev, content }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleAddResource = () => {
    setLessonData(prev => ({
      ...prev,
      resources: [
        ...(prev.resources || []),
        { title: '', url: '', type: 'link' }
      ]
    }));
  };

  const handleResourceChange = (index: number, field: string, value: string) => {
    const updatedResources = [...(lessonData.resources || [])];
    updatedResources[index] = { ...updatedResources[index], [field]: value };
    setLessonData(prev => ({ ...prev, resources: updatedResources }));
  };

  const handleRemoveResource = (index: number) => {
    const updatedResources = (lessonData.resources || []).filter((_, i) => i !== index);
    setLessonData(prev => ({ ...prev, resources: updatedResources }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!lessonData.title) {
        toast.error('Lesson title is required');
        return;
      }

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('title', lessonData.title);
      formData.append('content', lessonData.content);
      formData.append('type', lessonData.type);
      formData.append('duration', String(lessonData.duration));
      formData.append('order', String(lessonData.order));
      formData.append('isPublished', String(lessonData.isPublished));
      
      if (videoFile) {
        formData.append('video', videoFile);
      }

      if (lessonData.resources) {
        formData.append('resources', JSON.stringify(lessonData.resources));
      }

      await onSave(formData);
      toast.success('Lesson saved successfully');
    } catch (error) {
      toast.error('Failed to save lesson');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {lesson?.id ? 'Edit Lesson' : 'Create New Lesson'}
        </h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setLessonData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
          >
            {lessonData.isPublished ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Published
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Draft
              </>
            )}
          </Button>
          <span className="text-sm text-gray-500">
            Order: {lessonData.order}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <Input
            label="Lesson Title"
            value={lessonData.title}
            onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter lesson title"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Lesson Content</label>
            <div className="bg-white rounded-lg border">
              <ReactQuill
                theme="snow"
                value={lessonData.content}
                onChange={handleContentChange}
                modules={quillModules}
                className="h-96"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Lesson Type</label>
            <Select
              value={lessonData.type}
              onChange={(e) => setLessonData(prev => ({ ...prev, type: e.target.value as any }))}
              options={lessonTypeOptions}
            />
          </div>

          {lessonData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium mb-2">Video Upload</label>
              <div className="border-2 border-dashed rounded-lg p-6">
                {videoPreview ? (
                  <div className="space-y-4">
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full max-h-96 rounded"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoFile(null);
                      }}
                    >
                      Remove Video
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      MP4, WebM up to 500MB
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      Select Video
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Input
                  label="Or enter video URL"
                  value={lessonData.videoUrl}
                  onChange={(e) => setLessonData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Lesson Resources</h3>
            <Button variant="outline" size="sm" onClick={handleAddResource}>
              Add Resource
            </Button>
          </div>

          {lessonData.resources?.map((resource, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">Resource {index + 1}</h4>
                <button
                  onClick={() => handleRemoveResource(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Resource title"
                  value={resource.title}
                  onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Resource URL"
                  value={resource.url}
                  onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                />
                <Select
                  value={resource.type}
                  onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                  options={resourceTypeOptions}
                />
              </div>
            </Card>
          ))}

          {(!lessonData.resources || lessonData.resources.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No resources added yet</p>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <Input
              type="number"
              value={lessonData.duration}
              onChange={(e) => setLessonData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <Input
              type="number"
              value={lessonData.order}
              onChange={(e) => setLessonData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
              min={1}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={lessonData.isPublished}
              onChange={(e) => setLessonData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="mr-2"
            />
            <label className="text-sm">Publish immediately</label>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          <Save className="w-4 h-4 mr-2" />
          Save Lesson
        </Button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, X, Plus, Trash2, Upload, Video
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { toast } from 'react-hot-toast';

// Define the form data type
export interface CourseFormData {
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  duration: number;
  price: number;
  discountPrice?: number;
  hasCertificate: boolean;
  prerequisites: string[];
  learningObjectives: Array<{ objective: string }>;
  syllabus: Array<{
    week: number;
    title: string;
    description: string;
    topics: string[];
  }>;
  thumbnail?: File | string;
  promoVideo?: File | string;
  status: 'draft' | 'published' | 'archived';
}

// Create zod schema
const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  subtitle: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.string().min(1, 'Language is required'),
  duration: z.number().min(1, 'Duration is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  discountPrice: z.number().optional(),
  hasCertificate: z.boolean().default(true),
  prerequisites: z.array(z.string()),
  learningObjectives: z.array(z.object({
    objective: z.string().min(1, 'Learning objective is required')
  })),
  syllabus: z.array(z.object({
    week: z.number(),
    title: z.string(),
    description: z.string(),
    topics: z.array(z.string())
  })),
  thumbnail: z.any().optional(),
  promoVideo: z.any().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
});

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

// Options for selects
const categoryOptions = [
  { value: '', label: 'Select category' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'languages', label: 'Languages' },
  { value: 'humanities', label: 'Humanities' },
  { value: 'technology', label: 'Technology' },
  { value: 'arts', label: 'Arts' }
];

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    typeof initialData?.thumbnail === 'string' ? initialData.thumbnail : null
  );
  const [videoPreview, setVideoPreview] = useState<string | null>(
    typeof initialData?.promoVideo === 'string' ? initialData.promoVideo : null
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      level: initialData?.level || 'beginner',
      language: initialData?.language || 'English',
      duration: initialData?.duration || 0,
      price: initialData?.price || 0,
      discountPrice: initialData?.discountPrice,
      hasCertificate: initialData?.hasCertificate !== undefined ? initialData.hasCertificate : true,
      prerequisites: initialData?.prerequisites || [''],
      learningObjectives: initialData?.learningObjectives || [{ objective: '' }],
      syllabus: initialData?.syllabus || [{
        week: 1,
        title: '',
        description: '',
        topics: ['']
      }],
      thumbnail: initialData?.thumbnail,
      promoVideo: initialData?.promoVideo,
      status: initialData?.status || 'draft'
    }
  });

  const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = 
    useFieldArray({ control, name: 'learningObjectives' });

  const { fields: syllabusFields, append: appendSyllabus, remove: removeSyllabus } = 
    useFieldArray({ control, name: 'syllabus' });

  const selectedCategory = watch('category');
  const selectedLevel = watch('level');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue('thumbnail', file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setValue('promoVideo', file);
    }
  };

  const onFormSubmit = async (data: CourseFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'thumbnail' || key === 'promoVideo') {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'string' && value.startsWith('http')) {
              // Keep existing URL as is
              formData.append(key, value);
            }
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            formData.append(key, String(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      await onSubmit(formData);
      toast.success('Course saved successfully!');
    } catch (error) {
      toast.error('Failed to save course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course Title *</label>
            <Input
              {...register('title')}
              error={errors.title?.message}
              placeholder="e.g., Advanced Mathematics for High School"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <Input
              {...register('subtitle')}
              placeholder="A catchy subtitle for your course"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <Textarea
              {...register('description')}
              error={errors.description?.message}
              rows={5}
              placeholder="Provide a detailed description of your course..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={selectedCategory}
                onChange={(e) => setValue('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Level *</label>
              <select
                value={selectedLevel}
                onChange={(e) => setValue('level', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {levelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Language *</label>
              <Input {...register('language')} placeholder="English" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration (hours) *</label>
              <Input 
                type="number" 
                {...register('duration', { valueAsNumber: true })}
                error={errors.duration?.message}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Pricing */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($) *</label>
            <Input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Price ($)</label>
            <Input
              type="number"
              step="0.01"
              {...register('discountPrice', { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            {...register('hasCertificate')}
            className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="text-sm">Include certificate of completion</label>
        </div>
      </Card>

      {/* Learning Objectives */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Learning Objectives</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendObjective({ objective: '' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Objective
          </Button>
        </div>
        <div className="space-y-3">
          {objectiveFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                {...register(`learningObjectives.${index}.objective`)}
                placeholder={`What will students learn? (Objective ${index + 1})`}
              />
              {objectiveFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Syllabus */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Course Syllabus</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendSyllabus({
              week: syllabusFields.length + 1,
              title: '',
              description: '',
              topics: ['']
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Week
          </Button>
        </div>

        <div className="space-y-6">
          {syllabusFields.map((field, weekIndex) => (
            <div key={field.id} className="border rounded-lg p-4 relative">
              {syllabusFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSyllabus(weekIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <h3 className="font-medium mb-3">Week {weekIndex + 1}</h3>

              <div className="space-y-3">
                <Input
                  {...register(`syllabus.${weekIndex}.title`)}
                  placeholder="Week title"
                />

                <Textarea
                  {...register(`syllabus.${weekIndex}.description`)}
                  placeholder="Week description"
                  rows={2}
                />

                <div>
                  <label className="block text-sm font-medium mb-1">Topics</label>
                  <div className="space-y-2">
                    {field.topics?.map((_, topicIndex) => (
                      <div key={topicIndex} className="flex items-center space-x-2">
                        <Input
                          {...register(`syllabus.${weekIndex}.topics.${topicIndex}`)}
                          placeholder={`Topic ${topicIndex + 1}`}
                        />
                        {topicIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentTopics = [...(field.topics || [])];
                              currentTopics.splice(topicIndex, 1);
                              setValue(`syllabus.${weekIndex}.topics`, currentTopics);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentTopics = [...(field.topics || []), ''];
                        setValue(`syllabus.${weekIndex}.topics`, currentTopics);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Topic
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Media */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Course Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {thumbnailPreview ? (
                <div className="relative">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="max-h-40 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview(null);
                      setValue('thumbnail', undefined);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Promo Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Promo Video</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {videoPreview ? (
                <div className="relative">
                  <video 
                    src={videoPreview} 
                    controls 
                    className="max-h-40 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(videoPreview);
                      setVideoPreview(null);
                      setValue('promoVideo', undefined);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Upload a promo video</p>
                  <p className="text-xs text-gray-400">MP4, WebM up to 50MB</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById('video-upload')?.click()}
                  >
                    Select Video
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Course
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
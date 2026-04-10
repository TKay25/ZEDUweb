// EditCourse.tsx
import React, { useState, useEffect } from 'react';
import { CourseForm } from '../../components/tutor/CourseForm';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

interface CourseFormData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail?: string;
  objectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  whatYouWillLearn?: string[];
}

export const EditCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<Partial<CourseFormData> | undefined>(undefined);

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Transform the data to match the CourseForm expected format
      const course = response.data;
      const formattedData: Partial<CourseFormData> = {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        price: course.price,
        thumbnail: course.thumbnail,
        objectives: course.objectives || [],
        requirements: course.requirements || [],
        targetAudience: course.targetAudience || [],
        whatYouWillLearn: course.whatYouWillLearn || []
      };
      
      setCourseData(formattedData);
    } catch (error: any) {
      console.error('Failed to load course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load course';
      toast.error(errorMessage);
      navigate('/tutor/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/tutor/courses/${courseId}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Course updated successfully!');
      navigate('/tutor/courses');
    } catch (error: any) {
      console.error('Failed to update course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update course';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/tutor/courses');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
        <p className="text-gray-600 mt-1">Update your course information and content</p>
      </div>
      
      {courseData ? (
        <CourseForm
          initialData={courseData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Course data not found</p>
          <button
            onClick={() => navigate('/tutor/courses')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default EditCourse;
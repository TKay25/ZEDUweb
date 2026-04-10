// CreateCourse.tsx
import React from 'react';
import { CourseForm } from '../../components/tutor/CourseForm';
import  tutorAPI  from '../../api/tutor.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const CreateCourse: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      await tutorAPI.createCourse(formData);
      toast.success('Course created successfully!');
      navigate('/tutor/courses');
    } catch (error) {
      toast.error('Failed to create course');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/tutor/courses');
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      <CourseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};


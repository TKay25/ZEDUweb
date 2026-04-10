// frontend/src/api/tutor.api.ts
import api from './axios.config';
import type { AxiosResponse } from 'axios'; // Changed to type-only import
import type { Course, Module } from './student.api'; // Changed to type-only import

export interface TutorProfile {
  id: string;
  bio: string;
  qualifications: string[];
  specialties: string[];
  rating: number;
  totalStudents: number;
  totalCourses: number;
  earnings: {
    total: number;
    thisMonth: number;
    pending: number;
  };
  availability: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface CourseCreation {
  title: string;
  description: string;
  subject: string;
  grade: number;
  price?: number;
  thumbnail?: File;
  modules: ModuleCreation[];
}

export interface ModuleCreation {
  title: string;
  type: 'video' | 'quiz' | 'assignment' | 'reading';
  content: any;
  duration: string;
  order: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: number;
  averageGrade: number;
  lastActive: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

class TutorAPI {
  private static instance: TutorAPI;
  
  private constructor() {}
  
  static getInstance(): TutorAPI {
    if (!TutorAPI.instance) {
      TutorAPI.instance = new TutorAPI();
    }
    return TutorAPI.instance;
  }

  // Profile Management
  async getProfile(): Promise<TutorProfile> {
    try {
      const response: AxiosResponse<TutorProfile> = await api.get('/tutor/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profileData: Partial<TutorProfile>): Promise<TutorProfile> {
    try {
      const response: AxiosResponse<TutorProfile> = await api.put('/tutor/profile', profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response: AxiosResponse<{ avatarUrl: string }> = await api.post('/tutor/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Course Management
  async getMyCourses(): Promise<Course[]> {
    try {
      const response: AxiosResponse<Course[]> = await api.get('/tutor/courses');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCourse(courseData: FormData): Promise<Course> {
    try {
      const response: AxiosResponse<Course> = await api.post('/tutor/courses', courseData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCourse(courseId: string, courseData: FormData): Promise<Course> {
    try {
      const response: AxiosResponse<Course> = await api.put(`/tutor/courses/${courseId}`, courseData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.delete(`/tutor/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async publishCourse(courseId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/tutor/courses/${courseId}/publish`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Module Management
  async addModule(courseId: string, moduleData: ModuleCreation): Promise<Module> {
    try {
      const response: AxiosResponse<Module> = await api.post(`/tutor/courses/${courseId}/modules`, moduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateModule(courseId: string, moduleId: string, moduleData: Partial<ModuleCreation>): Promise<Module> {
    try {
      const response: AxiosResponse<Module> = await api.put(`/tutor/courses/${courseId}/modules/${moduleId}`, moduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteModule(courseId: string, moduleId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.delete(`/tutor/courses/${courseId}/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async reorderModules(courseId: string, moduleOrder: string[]): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.put(`/tutor/courses/${courseId}/modules/reorder`, { moduleOrder });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Student Management
  async getStudents(courseId?: string): Promise<Student[]> {
    try {
      const url = courseId ? `/tutor/students?courseId=${courseId}` : '/tutor/students';
      const response: AxiosResponse<Student[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStudentDetails(studentId: string): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await api.get(`/tutor/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async gradeAssignment(assignmentId: string, grade: number, feedback: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/tutor/assignments/${assignmentId}/grade`, {
        grade,
        feedback
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Analytics
  async getCourseAnalytics(courseId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.get(`/tutor/analytics/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStudentProgress(courseId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.get(`/tutor/analytics/courses/${courseId}/progress`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Feedback
  async getFeedback(): Promise<Feedback[]> {
    try {
      const response: AxiosResponse<Feedback[]> = await api.get('/tutor/feedback');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Availability
  async setAvailability(slots: AvailabilitySlot[]): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.put('/tutor/availability', { slots });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Live Sessions
  async scheduleSession(sessionData: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.post('/tutor/sessions', sessionData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSessions(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await api.get('/tutor/sessions');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data?.message || 'Tutor API error');
    }
    return new Error('Network error');
  }
}

export default TutorAPI.getInstance();
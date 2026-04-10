// src/api/student.api.ts
import api from './axios.config';
// ✅ Correct - Type-only import
import type { AxiosResponse } from 'axios';

// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  progress: number;
  grade: number;
  subject: string;
  duration: string;
  modules: Module[];
  enrolledAt: string;
  completedAt?: string;
  certificate?: string;
}

export interface Module {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'assignment' | 'reading';
  duration: string;
  completed: boolean;
  content?: any;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  submitted: boolean;
  grade?: number;
  feedback?: string;
  attachments?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  timeLimit: number;
  questions: Question[];
  attempts: number;
  maxAttempts: number;
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  points: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'link';
  url: string;
  courseId: string;
  downloaded: boolean;
  size?: string;
  lastAccessed?: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  courseId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  replies: number;
  createdAt: string;
  isPinned: boolean;
  isResolved: boolean;
}

export interface Gradebook {
  courses: {
    courseId: string;
    courseName: string;
    assignments: {
      id: string;
      name: string;
      weight: number;
      score: number;
      maxScore: number;
    }[];
    totalScore: number;
    totalMaxScore: number;
    percentage: number;
    letterGrade: string;
  }[];
  cumulativeGPA: number;
  academicStanding: string;
}

export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  averageGrade: number;
  totalHours: number;
  upcomingAssignments: number;
  achievements: number;
}

class StudentAPI {
  private static instance: StudentAPI;
  
  private constructor() {}
  
  static getInstance(): StudentAPI {
    if (!StudentAPI.instance) {
      StudentAPI.instance = new StudentAPI();
    }
    return StudentAPI.instance;
  }

  // Dashboard Overview
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response: AxiosResponse<DashboardStats> = await api.get('/student/dashboard/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Courses
  async getMyCourses(): Promise<Course[]> {
    try {
      const response: AxiosResponse<Course[]> = await api.get('/student/courses');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseDetails(courseId: string): Promise<Course> {
    try {
      const response: AxiosResponse<Course> = await api.get(`/student/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post('/student/courses/enroll', { courseId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCourseProgress(courseId: string, moduleId: string): Promise<{ progress: number }> {
    try {
      const response: AxiosResponse<{ progress: number }> = await api.put(`/student/courses/${courseId}/progress`, { moduleId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Assignments
  async getAssignments(courseId?: string): Promise<Assignment[]> {
    try {
      const url = courseId ? `/student/assignments?courseId=${courseId}` : '/student/assignments';
      const response: AxiosResponse<Assignment[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async submitAssignment(assignmentId: string, files: File[], comment?: string): Promise<{ message: string }> {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      if (comment) formData.append('comment', comment);
      
      const response: AxiosResponse<{ message: string }> = await api.post(
        `/student/assignments/${assignmentId}/submit`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Quizzes
  async getQuizzes(courseId?: string): Promise<Quiz[]> {
    try {
      const url = courseId ? `/student/quizzes?courseId=${courseId}` : '/student/quizzes';
      const response: AxiosResponse<Quiz[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async startQuiz(quizId: string): Promise<Quiz> {
    try {
      const response: AxiosResponse<Quiz> = await api.post(`/student/quizzes/${quizId}/start`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async submitQuiz(quizId: string, answers: Record<string, any>): Promise<{ score: number; feedback: any }> {
    try {
      const response: AxiosResponse<{ score: number; feedback: any }> = await api.post(
        `/student/quizzes/${quizId}/submit`,
        { answers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Study Materials
  async getStudyMaterials(courseId?: string): Promise<StudyMaterial[]> {
    try {
      const url = courseId ? `/student/materials?courseId=${courseId}` : '/student/materials';
      const response: AxiosResponse<StudyMaterial[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadMaterial(materialId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get(`/student/materials/${materialId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Discussions
  async getDiscussions(courseId: string): Promise<Discussion[]> {
    try {
      const response: AxiosResponse<Discussion[]> = await api.get(`/student/courses/${courseId}/discussions`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDiscussion(courseId: string, title: string, content: string): Promise<Discussion> {
    try {
      const response: AxiosResponse<Discussion> = await api.post(`/student/courses/${courseId}/discussions`, {
        title,
        content
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Gradebook
  async getGradebook(): Promise<Gradebook> {
    try {
      const response: AxiosResponse<Gradebook> = await api.get('/student/gradebook');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Learning Path
  async getRecommendedCourses(): Promise<Course[]> {
    try {
      const response: AxiosResponse<Course[]> = await api.get('/student/recommendations');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Calendar/Schedule
  async getSchedule(date?: string): Promise<any> {
    try {
      const url = date ? `/student/schedule?date=${date}` : '/student/schedule';
      const response: AxiosResponse<any> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data?.message || 'Student API error');
    }
    return new Error('Network error');
  }
}

export default StudentAPI.getInstance();
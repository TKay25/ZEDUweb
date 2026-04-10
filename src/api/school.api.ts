// src/api/school.api.ts
import api from './axios.config';
import type { AxiosResponse } from 'axios';

// Educational Levels
export type EducationLevel = 'ecd' | 'primary' | 'secondary' | 'tertiary' | 'university';
export type ECDLevel = 'ecd1' | 'ecd2' | 'ecd3' | 'pre-school';
export type PrimaryLevel = 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6' | 'grade7';
export type SecondaryLevel = 'form1' | 'form2' | 'form3' | 'form4' | 'form5' | 'form6';
export type TertiaryLevel = 'certificate' | 'diploma' | 'higher-diploma' | 'advanced-diploma';
export type UniversityLevel = 'year1' | 'year2' | 'year3' | 'year4' | 'masters' | 'phd';

export interface SchoolProfile {
  id: string;
  name: string;
  educationLevels: EducationLevel[]; // Multiple levels if it's a combined school
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  accreditation?: string;
  establishedYear?: number;
  motto?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  educationLevel: EducationLevel;
  grade: string; // Will be specific to level: ECD1, Grade1, Form1, Year1, etc.
  class: string;
  dateOfBirth: Date;
  enrollmentDate: string;
  expectedGraduationDate?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
  specialNeeds?: string[];
  previousSchool?: string;
  attendance: number;
  averageGrade: number;
  credits?: number; // For university
  gpa?: number; // For university
  cgpa?: number; // For university
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string[];
  specializations: string[];
  educationLevels: EducationLevel[]; // Which levels they can teach
  subjects: string[];
  courses: number; // For tertiary/university
  students: number;
  status: 'active' | 'inactive' | 'on-leave';
  joinedAt: string;
  department?: string; // For tertiary/university
  researchArea?: string[]; // For university
  publications?: number; // For university
}

export interface Class {
  id: string;
  name: string;
  educationLevel: EducationLevel;
  grade: string;
  homeroomTeacher: string;
  students: number;
  subjects: string[];
  schedule: any;
  academicYear: string;
  term?: string; // For primary/secondary
  semester?: string; // For tertiary/university
  credits?: number; // For tertiary/university
}

export interface Course { // For tertiary/university
  id: string;
  code: string;
  name: string;
  credits: number;
  level: number;
  department: string;
  instructor: string;
  prerequisites: string[];
  description: string;
}

export interface ECDRecord {
  id: string;
  studentId: string;
  developmentalMilestones: {
    physical: string[];
    cognitive: string[];
    social: string[];
    emotional: string[];
    language: string[];
  };
  immunizationRecords: {
    vaccine: string;
    date: Date;
    administeredBy: string;
  }[];
  assessment: {
    creativity: number;
    curiosity: number;
    cooperation: number;
    selfControl: number;
  };
  portfolio: {
    activity: string;
    date: Date;
    observations: string;
    photos?: string[];
  }[];
}

export interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalStaff: number;
    totalClasses: number;
    totalRevenue: number;
    averageAttendance: number;
    retentionRate: number;
    graduationRate: number;
    parentSatisfaction: number;
  };
  trends: {
    enrollment: Array<{ month: string; students: number; level: EducationLevel }>;
    attendance: Array<{ month: string; rate: number; level: EducationLevel }>;
    performance: Array<{ month: string; average: number; level: EducationLevel }>;
    revenue: Array<{ month: string; amount: number }>;
    retention: Array<{ year: string; rate: number; level: EducationLevel }>;
  };
  demographics: {
    gender: Array<{ name: string; value: number }>;
    ageGroups: Array<{ group: string; count: number; level: EducationLevel }>;
    locations: Array<{ location: string; count: number }>;
    performanceByLevel: Array<{ level: string; average: number }>;
  };
  ecd: {
    developmentalMilestones: Array<{ milestone: string; achieved: number; target: number }>;
    schoolReadiness: Array<{ metric: string; percentage: number }>;
    immunizationCoverage: number;
    parentInvolvement: number;
  };
  primary: {
    literacyRate: number;
    numeracyRate: number;
    subjectPerformance: Array<{ subject: string; average: number }>;
    transitionRate: number; // to secondary
  };
  secondary: {
    examPassRate: number;
    subjectPerformance: Array<{ subject: string; average: number }>;
    universityPlacement: number;
    careerGuidance: number;
  };
  tertiary: {
    courseCompletionRate: number;
    employmentRate: number;
    internshipPlacement: number;
    industryPartnerships: number;
    certificationRate: number;
  };
  university: {
    researchOutput: number;
    publicationCount: number;
    graduateEmploymentRate: number;
    postgraduateEnrollment: number;
    internationalStudents: number;
    industryCollaborations: number;
    citationIndex: number;
  };
  financial: {
    revenueBySource: Array<{ source: string; amount: number }>;
    expensesByCategory: Array<{ category: string; amount: number }>;
    monthlyCashflow: Array<{ month: string; revenue: number; expenses: number }>;
    scholarshipAllocation: Array<{ level: string; amount: number }>;
    researchGrants: Array<{ grant: string; amount: number }>; // For university
  };
  engagement: {
    dailyActive: Array<{ date: string; users: number }>;
    featureUsage: Array<{ feature: string; usage: number }>;
    parentEngagement: Array<{ month: string; rate: number; level: EducationLevel }>;
    alumniEngagement: number; // For university
    communityOutreach: number;
  };
}

class SchoolAPI {
  private static instance: SchoolAPI;
  
  private constructor() {}
  
  static getInstance(): SchoolAPI {
    if (!SchoolAPI.instance) {
      SchoolAPI.instance = new SchoolAPI();
    }
    return SchoolAPI.instance;
  }

  // School Profile
  async getProfile(): Promise<SchoolProfile> {
    try {
      const response: AxiosResponse<SchoolProfile> = await api.get('/school/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profileData: Partial<SchoolProfile>): Promise<SchoolProfile> {
    try {
      const response: AxiosResponse<SchoolProfile> = await api.put('/school/profile', profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Student Management with Level Support
  async getStudents(level?: EducationLevel): Promise<Student[]> {
    try {
      const url = level ? `/school/students?level=${level}` : '/school/students';
      const response: AxiosResponse<Student[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addStudent(studentData: Omit<Student, 'id'>): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await api.post('/school/students', studentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStudent(studentId: string, studentData: Partial<Student>): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await api.put(`/school/students/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteStudent(studentId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.delete(`/school/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ECD Specific Methods
  async getECDRecords(studentId: string): Promise<ECDRecord> {
    try {
      const response: AxiosResponse<ECDRecord> = await api.get(`/school/ecd/${studentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateECDMilestones(studentId: string, milestones: Partial<ECDRecord>): Promise<ECDRecord> {
    try {
      const response: AxiosResponse<ECDRecord> = await api.put(`/school/ecd/${studentId}`, milestones);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Teacher Management
  async getTeachers(level?: EducationLevel): Promise<Teacher[]> {
    try {
      const url = level ? `/school/teachers?level=${level}` : '/school/teachers';
      const response: AxiosResponse<Teacher[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addTeacher(teacherData: Omit<Teacher, 'id'>): Promise<Teacher> {
    try {
      const response: AxiosResponse<Teacher> = await api.post('/school/teachers', teacherData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTeacher(teacherId: string, teacherData: Partial<Teacher>): Promise<Teacher> {
    try {
      const response: AxiosResponse<Teacher> = await api.put(`/school/teachers/${teacherId}`, teacherData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTeacher(teacherId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.delete(`/school/teachers/${teacherId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Class Management with Level Support
  async getClasses(level?: EducationLevel): Promise<Class[]> {
    try {
      const url = level ? `/school/classes?level=${level}` : '/school/classes';
      const response: AxiosResponse<Class[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClass(classData: Omit<Class, 'id'>): Promise<Class> {
    try {
      const response: AxiosResponse<Class> = await api.post('/school/classes', classData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Course Management (for Tertiary/University)
  async getCourses(level?: EducationLevel): Promise<Course[]> {
    try {
      const url = level ? `/school/courses?level=${level}` : '/school/courses';
      const response: AxiosResponse<Course[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    try {
      const response: AxiosResponse<Course> = await api.post('/school/courses', courseData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Analytics with Level Filtering
  async getAnalytics(level?: EducationLevel, year?: string): Promise<AnalyticsData> {
    try {
      let url = '/school/analytics';
      const params = new URLSearchParams();
      if (level) params.append('level', level);
      if (year) params.append('year', year);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response: AxiosResponse<AnalyticsData> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateReport(type: string, level?: EducationLevel, period?: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.post('/school/reports', { type, level, period });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admissions with Level Support
  async getApplicants(level?: EducationLevel): Promise<{ data: Applicant[] }> {
    try {
      const url = level ? `/school/admissions/applicants?level=${level}` : '/school/admissions/applicants';
      const response: AxiosResponse<Applicant[]> = await api.get(url);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAdmissionStats(level?: EducationLevel): Promise<{ data: AdmissionStats }> {
    try {
      const url = level ? `/school/admissions/stats?level=${level}` : '/school/admissions/stats';
      const response: AxiosResponse<AdmissionStats> = await api.get(url);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateApplicantStatus(applicantId: string, status: Applicant['status']): Promise<{ data: Applicant }> {
    try {
      const response: AxiosResponse<Applicant> = await api.patch(`/school/admissions/applicants/${applicantId}/status`, { status });
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendAdmissionEmail(applicantId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/school/admissions/applicants/${applicantId}/email`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async scheduleInterview(applicantId: string, date: Date): Promise<{ data: Applicant }> {
    try {
      const response: AxiosResponse<Applicant> = await api.post(`/school/admissions/applicants/${applicantId}/interview`, { date });
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyDocument(applicantId: string, documentId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/school/admissions/applicants/${applicantId}/documents/${documentId}/verify`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addApplicant(applicantData: Omit<Applicant, 'id' | 'applicationNumber' | 'submittedAt'>): Promise<{ data: Applicant }> {
    try {
      const response: AxiosResponse<Applicant> = await api.post('/school/admissions/applicants', applicantData);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkUploadApplicants(file: File): Promise<{ data: Applicant[] }> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response: AxiosResponse<Applicant[]> = await api.post('/school/admissions/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Transition Management (between levels)
  async promoteStudents(students: string[], fromLevel: EducationLevel, toLevel: EducationLevel): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post('/school/students/promote', {
        students,
        fromLevel,
        toLevel
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTransitionRates(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.get('/school/analytics/transition-rates');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data?.message || 'School API error');
    }
    return new Error('Network error');
  }
}

// Admissions Interfaces
export interface Applicant {
  id: string;
  applicationNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  avatar?: string;
  applyingFor: {
    level: EducationLevel;
    grade: string;
    academicYear: string;
    term?: string;
    program?: string; // For tertiary/university
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  parent: {
    name: string;
    relationship: string;
    email: string;
    phone: string;
    occupation?: string;
  };
  previousSchool?: {
    name: string;
    address: string;
    lastGrade: string;
    yearLeft: number;
    qualification?: string; // For tertiary/university
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    verified?: boolean;
  }>;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected' | 'waitlisted';
  submittedAt: Date;
  reviewedAt?: Date;
  interviewDate?: Date;
  interviewNotes?: string;
  remarks?: string;
  fees?: {
    applicationFee: number;
    paid: boolean;
    paidAt?: Date;
    receipt?: string;
  };
  entranceExam?: {
    score: number;
    date: Date;
    remarks?: string;
  };
}

export interface AdmissionStats {
  total: number;
  pending: number;
  reviewing: number;
  interview: number;
  accepted: number;
  rejected: number;
  waitlisted: number;
  byLevel: {
    ecd: number;
    primary: number;
    secondary: number;
    tertiary: number;
    university: number;
  };
}

export default SchoolAPI.getInstance();
// src/api/ministry.api.ts
import api from './axios.config';
import type { AxiosResponse } from 'axios';

export interface MinistryProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  logo?: string;
  established: Date;
  minister: {
    name: string;
    title: string;
    since: Date;
  };
  permanentSecretary: {
    name: string;
    email: string;
    phone: string;
  };
  departments: Array<{
    id: string;
    name: string;
    head: string;
    responsibilities: string[];
  }>;
  regions: Array<{
    id: string;
    name: string;
    head: string;
    office: string;
  }>;
  stats: {
    totalSchools: number;
    totalTeachers: number;
    totalStudents: number;
    totalStaff: number;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      alerts: boolean;
    };
  };
  officials: Array<{
    id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    avatar?: string;
  }>;
}
// Add to ministry.api.ts interfaces

export interface Tutor {
  id: string;
  name: string;
  tutorNumber: string;
  avatar?: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
    specialization?: string;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  experience: number;
  school?: {
    id: string;
    name: string;
    district: string;
    province: string;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verification: {
    status: 'verified' | 'pending' | 'rejected';
    lastVerified?: Date;
    documents: Array<{
      name: string;
      status: string;
    }>;
  };
  performance: {
    rating: number;
    studentFeedback: number;
    completionRate: number;
    trend: number;
  };
  employment: {
    type: 'full-time' | 'part-time' | 'contract';
    startDate: Date;
    endDate?: Date;
    subjects: string[];
  };
  location: {
    district: string;
    province: string;
  };
}

export interface TutorStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  bySubject: Array<{ subject: string; count: number }>;
  byQualification: Array<{ level: string; count: number }>;
  byProvince: Array<{ province: string; count: number }>;
}

// Add to ministry.api.ts interfaces

export interface SystemMetrics {
  overview: {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
    activeUsers: number;
    requestsPerMinute: number;
    errorRate: number;
    lastIncident?: Date;
  };
  services: Array<{
    id: string;
    name: string;
    type: 'api' | 'database' | 'cache' | 'queue' | 'storage';
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
    lastChecked: Date;
    metrics: {
      cpu?: number;
      memory?: number;
      disk?: number;
      connections?: number;
    };
  }>;
  performance: {
    cpu: Array<{ time: string; value: number }>;
    memory: Array<{ time: string; value: number }>;
    disk: Array<{ time: string; value: number }>;
    network: Array<{ time: string; inbound: number; outbound: number }>;
  };
  errors: {
    recent: Array<{
      id: string;
      timestamp: Date;
      service: string;
      level: 'error' | 'warning' | 'info';
      message: string;
      count: number;
    }>;
    byType: Array<{ type: string; count: number }>;
    byService: Array<{ service: string; count: number }>;
  };
  usage: {
    daily: Array<{ date: string; users: number; requests: number }>;
    features: Array<{ feature: string; usage: number }>;
    regions: Array<{ region: string; users: number }>;
  };
  security: {
    status: 'secure' | 'warning' | 'critical';
    lastScan: Date;
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    threats: Array<{
      id: string;
      type: string;
      severity: string;
      timestamp: Date;
      source: string;
      status: 'blocked' | 'investigating' | 'resolved';
    }>;
  };
  backups: {
    lastBackup: Date;
    status: 'success' | 'failed' | 'in-progress';
    size: number;
    location: string;
    schedule: string;
    retention: number;
  };
}

export interface SystemMetricsFilters {
  timeRange: string;
}

export interface School {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'primary' | 'secondary' | 'high' | 'combined';
  ownership: 'public' | 'private' | 'mission' | 'community';
  province: string;
  district: string;
  address: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  headTeacher: {
    name: string;
    email: string;
    phone: string;
  };
  stats: {
    students: number;
    teachers: number;
    classes: number;
    passRate: number;
    attendance: number;
  };
  verification: {
    status: 'verified' | 'pending' | 'rejected' | 'expired';
    lastVerified?: Date;
    expiresAt?: Date;
    documents: Array<{
      name: string;
      status: string;
    }>;
  };
  performance: {
    overall: number;
    trend: number;
    ranking: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolDetail {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'primary' | 'secondary' | 'high' | 'combined';
  ownership: 'public' | 'private' | 'mission' | 'community';
  province: string;
  district: string;
  ward?: string;
  address: {
    street: string;
    city: string;
    postalCode?: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  headTeacher: {
    id: string;
    name: string;
    email: string;
    phone: string;
    since: Date;
  };
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalStaff: number;
    totalClasses: number;
    studentTeacherRatio: number;
    averageClassSize: number;
    graduationRate: number;
    attendanceRate: number;
    passRate: number;
  };
  performance: {
    yearly: Array<{ year: string; passRate: number; enrollment: number }>;
    bySubject: Array<{ subject: string; score: number; nationalAverage: number }>;
    byGrade: Array<{ grade: string; students: number; passRate: number }>;
  };
  verification: {
    status: 'verified' | 'pending' | 'rejected' | 'expired';
    lastVerified?: Date;
    expiresAt?: Date;
    documents: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      url: string;
      uploadedAt: Date;
      verifiedAt?: Date;
    }>;
  };
  compliance: {
    inspections: Array<{
      id: string;
      date: Date;
      inspector: string;
      rating: number;
      findings: string;
      recommendations: string;
      followUpDate?: Date;
    }>;
    certifications: Array<{
      id: string;
      name: string;
      issuedBy: string;
      issuedDate: Date;
      expiryDate: Date;
      status: string;
    }>;
  };
  financials: {
    budget: number;
    expenditure: number;
    fees: {
      tuition: number;
      boarding?: number;
      other: Array<{ name: string; amount: number }>;
    };
    outstanding: number;
  };
  facilities: Array<{
    id: string;
    name: string;
    count: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    lastInspection?: Date;
  }>;
  staff: {
    teachers: Array<{
      id: string;
      name: string;
      subject: string;
      qualification: string;
      experience: number;
    }>;
    administration: Array<{
      id: string;
      name: string;
      role: string;
      since: Date;
    }>;
  };
  recentActivity: Array<{
    id: string;
    type: 'inspection' | 'verification' | 'report' | 'complaint';
    description: string;
    date: Date;
    status: string;
  }>;
}
// Add to ministry.api.ts interfaces

export interface Tutor {
  id: string;
  name: string;
  tutorNumber: string;
  avatar?: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
    specialization?: string;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  experience: number;
  school?: {
    id: string;
    name: string;
    district: string;
    province: string;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verification: {
    status: 'verified' | 'pending' | 'rejected';
    lastVerified?: Date;
    documents: Array<{
      name: string;
      status: string;
    }>;
  };
  performance: {
    rating: number;
    studentFeedback: number;
    completionRate: number;
    trend: number;
  };
  employment: {
    type: 'full-time' | 'part-time' | 'contract';
    startDate: Date;
    endDate?: Date;
    subjects: string[];
  };
  location: {
    district: string;
    province: string;
  };
}

export interface TutorStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  bySubject: Array<{ subject: string; count: number }>;
  byQualification: Array<{ level: string; count: number }>;
  byProvince: Array<{ province: string; count: number }>;
}

export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  school: {
    id: string;
    name: string;
    district: string;
    province: string;
  };
  grade: string;
  class?: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  performance: {
    average: number;
    trend: number;
    rank?: number;
    subjects: Array<{
      name: string;
      score: number;
    }>;
  };
  attendance: {
    overall: number;
    trend: number;
  };
  parent: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface StudentStats {
  total: number;
  active: number;
  graduated: number;
  transferred: number;
  byGender: Array<{ gender: string; count: number }>;
  byGrade: Array<{ grade: string; count: number }>;
  byProvince: Array<{ province: string; count: number }>;
}

export interface Curriculum {
  id: string;
  name: string;
  code: string;
  version: string;
  subject: string;
  grade: string;
  type: 'core' | 'elective' | 'vocational';
  status: 'draft' | 'review' | 'approved' | 'archived';
  description: string;
  objectives: string[];
  learningOutcomes: Array<{
    id: string;
    description: string;
    assessmentMethod: string;
  }>;
  topics: Array<{
    id: string;
    title: string;
    week: number;
    subtopics: string[];
    objectives: string[];
    duration: number;
    resources?: Array<{
      type: string;
      title: string;
      url?: string;
    }>;
  }>;
  assessment: {
    continuous: number;
    exams: number;
    practical?: number;
    criteria: Array<{
      name: string;
      weight: number;
      description: string;
    }>;
  };
  prerequisites: string[];
  textbooks: Array<{
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    year: number;
  }>;
  approvedBy?: string;
  approvedAt?: Date;
  validFrom: Date;
  validTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumStats {
  total: number;
  approved: number;
  draft: number;
  review: number;
  bySubject: Array<{ subject: string; count: number }>;
  byGrade: Array<{ grade: string; count: number }>;
}

export interface Subject {
  id: string;
  name: string;
  hoursRequired: number;
  objectives: string[];
  materials: string[];
  assessments: Assessment[];
}

export interface Assessment {
  id: string;
  name: string;
  type: 'standardized' | 'formative' | 'summative';
  weight: number;
  schedule: string;
}

export interface NationalStatistics {
  enrollmentRates: {
    primary: number;
    secondary: number;
    tertiary: number;
  };
  completionRates: {
    primary: number;
    secondary: number;
  };
  teacherStudentRatio: number;
  budgetAllocation: {
    salaries: number;
    infrastructure: number;
    resources: number;
    development: number;
  };
  performanceIndicators: any;
}

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'circular' | 'directive' | 'alert' | 'newsletter';
  priority: 'high' | 'medium' | 'low';
  target: {
    type: 'all' | 'provinces' | 'districts' | 'schools' | 'specific';
    provinces?: string[];
    districts?: string[];
    schools?: string[];
    recipients?: Array<{
      type: string;
      ids: string[];
    }>;
  };
  channels: Array<'email' | 'sms' | 'push' | 'portal' | 'app'>;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduledFor?: Date;
  sentAt?: Date;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: Date;
  stats: {
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
    total: number;
  };
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
  }>;
}

export interface BroadcastStats {
  total: number;
  sent: number;
  scheduled: number;
  draft: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  byType: Array<{ type: string; count: number }>;
  recentActivity: Array<{
    id: string;
    title: string;
    type: string;
    timestamp: Date;
    status: string;
  }>;
}

export interface ComplianceItem {
  id: string;
  entityType: 'school' | 'teacher' | 'tutor' | 'program';
  entityId: string;
  entityName: string;
  entityLocation?: string;
  requirement: string;
  category: 'registration' | 'certification' | 'inspection' | 'documentation' | 'safety' | 'curriculum';
  status: 'compliant' | 'non-compliant' | 'pending' | 'expired' | 'waived';
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  lastChecked?: Date;
  nextCheck?: Date;
  findings?: string;
  documents?: Array<{
    id: string;
    name: string;
    status: string;
    url: string;
  }>;
  actions?: Array<{
    id: string;
    description: string;
    deadline: Date;
    status: 'pending' | 'completed' | 'overdue';
  }>;
}

export interface ComplianceStats {
  overall: number;
  compliant: number;
  nonCompliant: number;
  pending: number;
  expired: number;
  byCategory: Array<{ category: string; compliant: number; total: number }>;
  byRegion: Array<{ region: string; rate: number; schools: number }>;
  recentIssues: Array<{
    id: string;
    entityName: string;
    issue: string;
    severity: string;
    date: Date;
  }>;
}

export interface DashboardStats {
  overview: {
    totalSchools: number;
    registeredSchools: number;
    pendingVerification: number;
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    graduationRate: number;
    averagePerformance: number;
  };
  regional: Array<{
    province: string;
    schools: number;
    students: number;
    teachers: number;
    performance: number;
    compliance: number;
  }>;
  trends: {
    enrollment: Array<{ year: string; students: number }>;
    performance: Array<{ year: string; average: number }>;
    schools: Array<{ year: string; count: number }>;
  };
  compliance: {
    verified: number;
    pending: number;
    expired: number;
    expiringSoon: number;
    byType: Array<{ type: string; count: number }>;
  };
  alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    region?: string;
  }>;
}

export interface DashboardFilters {
  region: string;
  period: string;
}

export interface PerformanceData {
  national: {
    averageScore: number;
    passRate: number;
    completionRate: number;
    totalStudents: number;
    totalSchools: number;
    topPerformingProvince: string;
    lowestPerformingProvince: string;
    trends: {
      yearly: Array<{ year: string; average: number; passRate: number }>;
      quarterly: Array<{ quarter: string; score: number }>;
    };
  };
  byProvince: Array<{
    province: string;
    students: number;
    schools: number;
    averageScore: number;
    passRate: number;
    completionRate: number;
    rank: number;
    trend: number;
  }>;
  bySubject: Array<{
    subject: string;
    averageScore: number;
    nationalAverage: number;
    passRate: number;
    totalStudents: number;
  }>;
  byGrade: Array<{
    grade: string;
    students: number;
    averageScore: number;
    passRate: number;
    topScore: number;
    lowestScore: number;
  }>;
  bySchoolType: Array<{
    type: string;
    averageScore: number;
    passRate: number;
    schools: number;
  }>;
  topSchools: Array<{
    id: string;
    name: string;
    province: string;
    averageScore: number;
    passRate: number;
    students: number;
    rank: number;
  }>;
  performanceGaps: Array<{
    category: string;
    urban: number;
    rural: number;
    gap: number;
  }>;
}

export interface PerformanceFilters {
  year: string;
  province: string;
}

export interface ExportFilters {
  year: string;
  province: string;
  format: string;
}

export interface Policy {
  id: string;
  title: string;
  reference: string;
  type: 'education' | 'administration' | 'finance' | 'personnel' | 'student' | 'safety';
  category: 'act' | 'regulation' | 'guideline' | 'circular' | 'directive';
  status: 'draft' | 'review' | 'approved' | 'active' | 'archived' | 'replaced';
  description: string;
  objectives: string[];
  scope: string[];
  applicability: Array<{
    entityType: string;
    description: string;
  }>;
  content: {
    sections: Array<{
      id: string;
      title: string;
      content: string;
      subsections?: Array<{
        title: string;
        content: string;
      }>;
    }>;
  };
  version: string;
  effectiveDate: Date;
  reviewDate?: Date;
  expiryDate?: Date;
  supersedes?: string[];
  supersededBy?: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  approvedBy: {
    id: string;
    name: string;
    title: string;
  };
  approvedAt: Date;
  lastReviewedAt?: Date;
  reviewedBy?: string;
  tags: string[];
  relatedPolicies: string[];
  compliance: {
    requirements: Array<{
      id: string;
      description: string;
      deadline?: Date;
      verificationRequired: boolean;
    }>;
  };
  statistics: {
    views: number;
    downloads: number;
    compliantEntities: number;
    totalEntities: number;
  };
}

export interface PolicyStats {
  total: number;
  active: number;
  draft: number;
  review: number;
  byType: Array<{ type: string; count: number }>;
  byCategory: Array<{ category: string; count: number }>;
  recentUpdates: Array<{
    id: string;
    title: string;
    updatedAt: Date;
    type: string;
  }>;
}

export interface Report {
  id: string;
  title: string;
  type: 'annual' | 'quarterly' | 'monthly' | 'special' | 'statistical' | 'compliance';
  category: 'education' | 'financial' | 'performance' | 'enrollment' | 'staff' | 'infrastructure';
  description: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  status: 'draft' | 'generated' | 'published' | 'archived';
  format: 'pdf' | 'excel' | 'csv' | 'html';
  size?: number;
  pages?: number;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: Date;
  publishedAt?: Date;
  lastDownloaded?: Date;
  downloadCount: number;
  tags: string[];
  data: {
    summary: Record<string, any>;
    charts?: Array<{
      id: string;
      type: string;
      title: string;
      data: any;
    }>;
    tables?: Array<{
      id: string;
      title: string;
      headers: string[];
      rows: any[];
    }>;
  };
  regions?: string[];
  metrics: Array<{
    name: string;
    value: number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  scheduled?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextRun: Date;
    recipients: string[];
  };
}

export interface ReportStats {
  total: number;
  generated: number;
  published: number;
  draft: number;
  byType: Array<{ type: string; count: number }>;
  recentDownloads: number;
  popularReports: Array<{
    id: string;
    title: string;
    downloads: number;
  }>;
}

class MinistryAPI {
  private static instance: MinistryAPI;
  
  private constructor() {}
  
  static getInstance(): MinistryAPI {
    if (!MinistryAPI.instance) {
      MinistryAPI.instance = new MinistryAPI();
    }
    return MinistryAPI.instance;
  }

  // Student Management
  async getStudents(): Promise<Student[]> {
    try {
      const response: AxiosResponse<Student[]> = await api.get('/ministry/students');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStudentStats(): Promise<StudentStats> {
    try {
      const response: AxiosResponse<StudentStats> = await api.get('/ministry/students/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportStudentData(): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get('/ministry/students/export', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add these methods to the MinistryAPI class

async getSystemMetrics(filters: SystemMetricsFilters): Promise<SystemMetrics> {
  try {
    const response: AxiosResponse<SystemMetrics> = await api.get('/ministry/system/metrics', {
      params: filters
    });
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async runBackup(): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post('/ministry/system/backup');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async runSecurityScan(): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post('/ministry/system/security-scan');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}
  // School Management
  async getAllSchools(): Promise<School[]> {
    try {
      const response: AxiosResponse<School[]> = await api.get('/ministry/schools');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSchoolDetail(schoolId: string): Promise<SchoolDetail> {
    try {
      const response: AxiosResponse<SchoolDetail> = await api.get(`/ministry/schools/${schoolId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifySchool(schoolId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/schools/${schoolId}/verify`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportSchoolReport(schoolId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get(`/ministry/schools/${schoolId}/export`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Profile Management
  async getProfile(): Promise<MinistryProfile> {
    try {
      const response: AxiosResponse<MinistryProfile> = await api.get('/ministry/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profile: MinistryProfile): Promise<MinistryProfile> {
    try {
      const response: AxiosResponse<MinistryProfile> = await api.put('/ministry/profile', profile);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadLogo(formData: FormData): Promise<{ url: string }> {
    try {
      const response: AxiosResponse<{ url: string }> = await api.post('/ministry/profile/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reports Management
  async getReports(): Promise<Report[]> {
    try {
      const response: AxiosResponse<Report[]> = await api.get('/ministry/reports');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getReportStats(): Promise<ReportStats> {
    try {
      const response: AxiosResponse<ReportStats> = await api.get('/ministry/reports/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateReport(params: any): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post('/ministry/reports/generate', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadReport(reportId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get(`/ministry/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async publishReport(reportId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/reports/${reportId}/publish`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async scheduleReport(reportId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/reports/${reportId}/schedule`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async shareReport(reportId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/reports/${reportId}/share`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Policy Management
  async getPolicies(): Promise<Policy[]> {
    try {
      const response: AxiosResponse<Policy[]> = await api.get('/ministry/policies');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPolicyStats(): Promise<PolicyStats> {
    try {
      const response: AxiosResponse<PolicyStats> = await api.get('/ministry/policies/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approvePolicy(policyId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/policies/${policyId}/approve`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async archivePolicy(policyId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/policies/${policyId}/archive`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async publishPolicy(policyId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/policies/${policyId}/publish`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadPolicy(policyId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get(`/ministry/policies/${policyId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

/*  // Add these methods to the MinistryAPI class

async getTutors(): Promise<Tutor[]> {
  try {
    const response: AxiosResponse<Tutor[]> = await api.get('/ministry/tutors');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async getTutorStats(): Promise<TutorStats> {
  try {
    const response: AxiosResponse<TutorStats> = await api.get('/ministry/tutors/stats');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async verifyTutor(tutorId: string): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/tutors/${tutorId}/verify`);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async suspendTutor(tutorId: string): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/tutors/${tutorId}/suspend`);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}*/
  // Performance Management
  async getPerformanceData(filters: PerformanceFilters): Promise<PerformanceData> {
    try {
      const response: AxiosResponse<PerformanceData> = await api.get('/ministry/performance', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportPerformanceReport(filters: ExportFilters): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get('/ministry/performance/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Dashboard Management
  async getDashboardStats(filters: DashboardFilters): Promise<DashboardStats> {
    try {
      const response: AxiosResponse<DashboardStats> = await api.get('/ministry/dashboard/stats', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportNationalReport(params: { region: string; period: string; format: string }): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get('/ministry/reports/national', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Curriculum Management
  async getCurriculums(): Promise<Curriculum[]> {
    try {
      const response: AxiosResponse<Curriculum[]> = await api.get('/ministry/curriculum');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurriculumStats(): Promise<CurriculumStats> {
    try {
      const response: AxiosResponse<CurriculumStats> = await api.get('/ministry/curriculum/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurriculum(grade?: number): Promise<Curriculum[]> {
    try {
      const url = grade ? `/ministry/curriculum?grade=${grade}` : '/ministry/curriculum';
      const response: AxiosResponse<Curriculum[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCurriculum(curriculumData: Omit<Curriculum, 'id'>): Promise<Curriculum> {
    try {
      const response: AxiosResponse<Curriculum> = await api.post('/ministry/curriculum', curriculumData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCurriculum(curriculumId: string, curriculumData: Partial<Curriculum>): Promise<Curriculum> {
    try {
      const response: AxiosResponse<Curriculum> = await api.put(`/ministry/curriculum/${curriculumId}`, curriculumData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approveCurriculum(curriculumId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/curriculum/${curriculumId}/approve`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async archiveCurriculum(curriculumId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/curriculum/${curriculumId}/archive`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportCurriculum(curriculumId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get(`/ministry/curriculum/${curriculumId}/export`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
// Add these methods to the MinistryAPI class

async getTutors(): Promise<Tutor[]> {
  try {
    const response: AxiosResponse<Tutor[]> = await api.get('/ministry/tutors');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async getTutorStats(): Promise<TutorStats> {
  try {
    const response: AxiosResponse<TutorStats> = await api.get('/ministry/tutors/stats');
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async verifyTutor(tutorId: string): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/tutors/${tutorId}/verify`);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}

async suspendTutor(tutorId: string): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/tutors/${tutorId}/suspend`);
    return response.data;
  } catch (error) {
    throw this.handleError(error);
  }
}
  // National Statistics
  async getNationalStatistics(): Promise<NationalStatistics> {
    try {
      const response: AxiosResponse<NationalStatistics> = await api.get('/ministry/statistics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRegionalStatistics(region: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.get(`/ministry/statistics/regions/${region}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reports Generation
  async generateNationalReport(period: string, type: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.post('/ministry/reports', { period, type });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateComparativeReport(regions: string[], period: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.post('/ministry/reports/comparative', { regions, period });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Funding Management
  async getBudgetAllocation(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.get('/ministry/budget');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async allocateFunds(allocation: any): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post('/ministry/budget/allocate', allocation);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Communications/Broadcast Management
  async getBroadcasts(): Promise<Broadcast[]> {
    try {
      const response: AxiosResponse<Broadcast[]> = await api.get('/ministry/broadcasts');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBroadcastStats(): Promise<BroadcastStats> {
    try {
      const response: AxiosResponse<BroadcastStats> = await api.get('/ministry/broadcasts/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendBroadcast(formData: FormData): Promise<Broadcast> {
    try {
      const response: AxiosResponse<Broadcast> = await api.post('/ministry/broadcasts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async scheduleBroadcast(broadcastId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/broadcasts/${broadcastId}/schedule`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelBroadcast(broadcastId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/broadcasts/${broadcastId}/cancel`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resendBroadcast(broadcastId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/broadcasts/${broadcastId}/resend`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Compliance Management
  async getComplianceItems(): Promise<ComplianceItem[]> {
    try {
      const response: AxiosResponse<ComplianceItem[]> = await api.get('/ministry/compliance');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getComplianceStats(): Promise<ComplianceStats> {
    try {
      const response: AxiosResponse<ComplianceStats> = await api.get('/ministry/compliance/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async scheduleInspection(itemId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/compliance/${itemId}/schedule-inspection`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async issueWarning(itemId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/ministry/compliance/${itemId}/issue-warning`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportComplianceReport(): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get('/ministry/compliance/export', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data?.message || 'Ministry API error');
    }
    return new Error('Network error');
  }
}

export default MinistryAPI.getInstance();
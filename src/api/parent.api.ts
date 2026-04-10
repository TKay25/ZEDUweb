// src/api/parent.api.ts
import api from './axios.config';
import type { AxiosResponse } from 'axios';

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  grade: number;
  enrolledCourses: number;
  averageGrade: number;
  attendance: number;
  lastActive: string;
}

export interface ChildProgress {
  childId: string;
  childName: string;
  overall: {
    average: number;
    trend: number;
    ranking: number;
    totalStudents: number;
    attendance: number;
    assignmentsCompleted: number;
    totalAssignments: number;
  };
  subjects: Array<{
    name: string;
    scores: Array<{
      date: string;
      score: number;
      type: 'test' | 'assignment' | 'exam';
    }>;
    average: number;
    trend: number;
    teacher: string;
    strengths: string[];
    improvements: string[];
  }>;
  timeline: Array<{
    date: string;
    events: Array<{
      type: 'grade' | 'attendance' | 'assignment' | 'achievement';
      title: string;
      description: string;
      value?: number;
    }>;
  }>;
  predictions: {
    nextScore: number;
    confidence: number;
    recommendedFocus: string[];
    predictedGrade: string;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: Date;
    type: 'academic' | 'attendance' | 'behavior' | 'extracurricular';
    badge?: string;
  }>;
}

export interface Report {
  id: string;
  childId: string;
  childName: string;
  period: string;
  generatedAt: string;
  summary: string;
  courses: {
    name: string;
    progress: number;
    grade: string;
    teacherComments: string;
  }[];
  attendance: {
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  achievements: string[];
  recommendations: string[];
  pdfUrl?: string;
}

export interface Payment {
  id: string;
  childId: string;
  childName: string;
  description: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  receipt?: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
}

export interface PaymentSummary {
  totalPaid: number;
  pendingAmount: number;
  upcomingAmount: number;
  overdueAmount: number;
  lastPayment: {
    amount: number;
    date: Date;
  };
  paymentMethods: Array<{
    type: string;
    last4?: string;
    expiryDate?: string;
    isDefault: boolean;
  }>;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'mobile';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
  icon?: string;
}

export interface Alert {
  id: string;
  type: 'grade' | 'attendance' | 'payment' | 'meeting' | 'behavior' | 'announcement' | 'deadline';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: Date;
  read: boolean;
  archived: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    childId?: string;
    childName?: string;
    amount?: number;
    dueDate?: Date;
    grade?: number;
    subject?: string;
    teacher?: string;
  };
}

export interface AlertStats {
  total: number;
  unread: number;
  critical: number;
  byType: Record<string, number>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  gradeAlerts: boolean;
  attendanceAlerts: boolean;
  paymentAlerts: boolean;
  meetingAlerts: boolean;
  behaviorAlerts: boolean;
  announcementAlerts: boolean;
  deadlineAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Profile Interfaces
export interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  occupation?: string;
  company?: string;
  profilePicture?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    gradeAlerts: boolean;
    attendanceAlerts: boolean;
    paymentReminders: boolean;
    meetingReminders: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    timezone: string;
  };
}

// Communication Interfaces
export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    role: 'teacher' | 'admin' | 'counselor';
    avatar?: string;
    subject?: string;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    read: boolean;
    senderId: string;
  };
  unreadCount: number;
  childName?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  subject?: string;
  childName?: string;
  email: string;
  phone: string;
  available: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}

// Dashboard Interfaces
export interface DashboardStats {
  totalChildren: number;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  upcomingMeetings: number;
  unreadMessages: number;
  recentAlerts: number;
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  childName: string;
  teacherName: string;
  datetime: Date;
  duration: number;
  type: 'parent-teacher' | 'academic-review' | 'disciplinary';
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

export interface RecentPayment {
  id: string;
  childName: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

// Meeting Interfaces
export interface Meeting {
  id: string;
  title: string;
  type: 'parent-teacher' | 'academic-review' | 'disciplinary' | 'career-guidance';
  datetime: Date;
  duration: number;
  location: 'physical' | 'virtual';
  link?: string;
  address?: string;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
    subject?: string;
  };
  child: {
    id: string;
    name: string;
    grade: string;
  };
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  agenda?: string[];
  materials?: Array<{
    name: string;
    url: string;
  }>;
}

class ParentAPI {
  private static instance: ParentAPI;
  
  private constructor() {}
  
  static getInstance(): ParentAPI {
    if (!ParentAPI.instance) {
      ParentAPI.instance = new ParentAPI();
    }
    return ParentAPI.instance;
  }

  // Profile Methods
  async getProfile(): Promise<ParentProfile> {
    try {
      const response: AxiosResponse<ParentProfile> = await api.get('/parent/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profile: Partial<ParentProfile>): Promise<ParentProfile> {
    try {
      const response: AxiosResponse<ParentProfile> = await api.put('/parent/profile', profile);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadProfilePicture(formData: FormData): Promise<{ url: string }> {
    try {
      const response: AxiosResponse<{ url: string }> = await api.post('/parent/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post('/parent/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotificationSettings(): Promise<NotificationPreferences> {
    try {
      const response: AxiosResponse<NotificationPreferences> = await api.get('/parent/profile/notifications');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationPreferences>): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.put('/parent/profile/notifications', settings);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Children Management
  async getChildren(): Promise<Child[]> {
    try {
      const response: AxiosResponse<Child[]> = await api.get('/parent/children');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addChild(childData: {
    email: string;
    firstName: string;
    lastName: string;
    grade: number;
    relationship: string;
  }): Promise<Child> {
    try {
      const response: AxiosResponse<Child> = await api.post('/parent/children', childData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeChild(childId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.delete(`/parent/children/${childId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Progress Tracking
  async getChildProgress(childId: string, period?: string): Promise<ChildProgress> {
    try {
      const url = period 
        ? `/parent/children/${childId}/progress?period=${period}`
        : `/parent/children/${childId}/progress`;
      const response: AxiosResponse<ChildProgress> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChildrenProgress(): Promise<ChildProgress[]> {
    try {
      const response: AxiosResponse<ChildProgress[]> = await api.get('/parent/children/progress');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChildGrades(childId: string, courseId?: string): Promise<any> {
    try {
      const url = courseId 
        ? `/parent/children/${childId}/grades?courseId=${courseId}`
        : `/parent/children/${childId}/grades`;
      const response: AxiosResponse<any> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChildAttendance(childId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await api.get(`/parent/children/${childId}/attendance`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reports
  async getReports(childId?: string): Promise<Report[]> {
    try {
      const url = childId ? `/parent/reports?childId=${childId}` : '/parent/reports';
      const response: AxiosResponse<Report[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateReport(childId: string, period: 'weekly' | 'monthly' | 'quarterly'): Promise<Report> {
    try {
      const response: AxiosResponse<Report> = await api.post(`/parent/children/${childId}/reports`, { period });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadReport(reportId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await api.get(`/parent/reports/${reportId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Payments
  async getPayments(childId?: string): Promise<Payment[]> {
    try {
      const url = childId ? `/parent/payments?childId=${childId}` : '/parent/payments';
      const response: AxiosResponse<Payment[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPaymentSummary(): Promise<PaymentSummary> {
    try {
      const response: AxiosResponse<PaymentSummary> = await api.get('/parent/payments/summary');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response: AxiosResponse<PaymentMethod[]> = await api.get('/parent/payments/methods');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async processPayment(paymentId: string, methodId: string): Promise<{ message: string; transactionId: string }> {
    try {
      const response: AxiosResponse<{ message: string; transactionId: string }> = await api.post(`/parent/payments/${paymentId}/process`, {
        paymentMethodId: methodId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getReceipt(paymentId: string): Promise<{ url: string; receiptNumber: string }> {
    try {
      const response: AxiosResponse<{ url: string; receiptNumber: string }> = await api.get(`/parent/payments/${paymentId}/receipt`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async makePayment(paymentId: string, paymentMethod: string): Promise<{ message: string; receipt: string }> {
    try {
      const response: AxiosResponse<{ message: string; receipt: string }> = await api.post(`/parent/payments/${paymentId}/pay`, {
        paymentMethod
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response: AxiosResponse<DashboardStats> = await api.get('/parent/dashboard/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUpcomingMeetings(): Promise<UpcomingMeeting[]> {
    try {
      const response: AxiosResponse<UpcomingMeeting[]> = await api.get('/parent/meetings/upcoming');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRecentPayments(limit: number = 5): Promise<RecentPayment[]> {
    try {
      const response: AxiosResponse<RecentPayment[]> = await api.get(`/parent/payments/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Meeting Methods
  async getMeetings(): Promise<Meeting[]> {
    try {
      const response: AxiosResponse<Meeting[]> = await api.get('/parent/meetings');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMeetingById(meetingId: string): Promise<Meeting> {
    try {
      const response: AxiosResponse<Meeting> = await api.get(`/parent/meetings/${meetingId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async confirmMeeting(meetingId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.patch(`/parent/meetings/${meetingId}/confirm`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelMeeting(meetingId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.patch(`/parent/meetings/${meetingId}/cancel`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async requestMeeting(meetingData: {
    teacherId: string;
    childId: string;
    proposedDates: Date[];
    agenda?: string[];
    type: Meeting['type'];
  }): Promise<Meeting> {
    try {
      const response: AxiosResponse<Meeting> = await api.post('/parent/meetings/request', meetingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Communication
  async sendMessageToTeacher(childId: string, teacherId: string, message: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post('/parent/messages', {
        childId,
        teacherId,
        message
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessagesByChild(childId?: string): Promise<any[]> {
    try {
      const url = childId ? `/parent/messages?childId=${childId}` : '/parent/messages';
      const response: AxiosResponse<any[]> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Communication Methods for Conversations
  async getConversations(): Promise<Conversation[]> {
    try {
      const response: AxiosResponse<Conversation[]> = await api.get('/parent/conversations');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      const response: AxiosResponse<Contact[]> = await api.get('/parent/contacts');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response: AxiosResponse<Message[]> = await api.get(`/parent/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAsRead(conversationId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.patch(`/parent/conversations/${conversationId}/read`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendMessage(conversationId: string, formData: FormData): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(`/parent/conversations/${conversationId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async startNewConversation(recipientId: string, subject: string, content: string, attachments?: File[]): Promise<{ conversationId: string }> {
    try {
      const formData = new FormData();
      formData.append('recipientId', recipientId);
      formData.append('subject', subject);
      formData.append('content', content);
      if (attachments) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response: AxiosResponse<{ conversationId: string }> = await api.post('/parent/conversations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Notifications & Alerts
  async getNotifications(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await api.get('/parent/notifications');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAlerts(): Promise<Alert[]> {
    try {
      const response: AxiosResponse<Alert[]> = await api.get('/parent/alerts');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAlertStats(): Promise<AlertStats> {
    try {
      const response: AxiosResponse<AlertStats> = await api.get('/parent/alerts/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response: AxiosResponse<NotificationPreferences> = await api.get('/parent/notifications/preferences');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAlertAsRead(alertId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.patch(`/parent/alerts/${alertId}/read`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAllAlertsAsRead(): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.patch('/parent/alerts/read-all');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async archiveAlert(alertId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.patch(`/parent/alerts/${alertId}/archive`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteAlert(alertId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.delete(`/parent/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateNotificationPreferences(preferences: NotificationPreferences): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.put('/parent/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Calendar
  async getFamilyCalendar(date?: string): Promise<any> {
    try {
      const url = date ? `/parent/calendar?date=${date}` : '/parent/calendar';
      const response: AxiosResponse<any> = await api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data?.message || 'Parent API error');
    }
    return new Error('Network error');
  }
}

export default ParentAPI.getInstance();
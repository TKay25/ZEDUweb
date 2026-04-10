import type { 
  ID, DateTime, Email, PhoneNumber, URL, 
  UserStatus, ParentChild, CommunicationPreferences 
} from './index';
import type { User } from './user.types';

export interface Parent extends User {
  role: 'parent';
  children?: ParentChild[];
  
  emergencyContact?: boolean;
  pickupAuthorized?: boolean;
  
  communicationPreferences?: CommunicationPreferences;
}

export interface ParentDashboard {
  parent: Parent;
  children: ParentChildSummary[];
  recentActivities: ParentActivity[];
  upcomingMeetings: ParentMeeting[];
  pendingPayments: PaymentSummary[];
  notifications: any[]; // Notification[]
}

export interface ParentChildSummary {
  id: ID;
  name: string;
  avatar?: URL;
  school: string;
  grade: string;
  attendance: number;
  averageGrade: number;
  upcomingAssignments: number;
  recentGrades: RecentGrade[];
  teachers: TeacherContact[];
}

export interface RecentGrade {
  id: ID;
  subject: string;
  assignment: string;
  grade: number;
  totalPoints: number;
  percentage: number;
  date: DateTime;
  feedback?: string;
}

export interface TeacherContact {
  id: ID;
  name: string;
  subject: string;
  email: Email;
  phone?: PhoneNumber;
  avatar?: URL;
  lastContact?: DateTime;
}

export interface ParentActivity {
  id: ID;
  type: 'grade' | 'attendance' | 'payment' | 'meeting' | 'message';
  title: string;
  description: string;
  childName?: string;
  timestamp: DateTime;
  read: boolean;
  actionUrl?: string;
}

export interface ParentMeeting {
  id: ID;
  title: string;
  childName: string;
  teacherName: string;
  teacherId: ID;
  datetime: DateTime;
  duration: number;
  type: 'parent-teacher' | 'academic-review' | 'disciplinary';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  location?: 'physical' | 'virtual';
  link?: URL;
  address?: string;
  notes?: string;
}

export interface PaymentSummary {
  id: ID;
  childName: string;
  description: string;
  amount: number;
  dueDate: DateTime;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: DateTime;
}

export interface ParentStudentProgress {
  studentId: ID;
  studentName: string;
  subjects: SubjectProgress[];
  overall: number;
  attendance: number;
  behavior: BehaviorReport[];
  teacherComments: TeacherComment[];
}

export interface SubjectProgress {
  subject: string;
  teacher: string;
  currentGrade: number;
  previousGrade?: number;
  trend: number;
  assignments: AssignmentProgress[];
  exams: ExamProgress[];
}

export interface AssignmentProgress {
  id: ID;
  title: string;
  dueDate: DateTime;
  submitted: boolean;
  grade?: number;
  feedback?: string;
}

export interface ExamProgress {
  id: ID;
  title: string;
  date: DateTime;
  grade?: number;
  feedback?: string;
}

export interface BehaviorReport {
  id: ID;
  date: DateTime;
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  reportedBy: string;
  action?: string;
}

export interface TeacherComment {
  id: ID;
  teacherName: string;
  subject: string;
  comment: string;
  date: DateTime;
  isPrivate: boolean;
}

export interface ParentMeetingRequest {
  teacherId: ID;
  childId: ID;
  preferredDates: DateTime[];
  duration: number;
  type: 'parent-teacher' | 'academic-review' | 'disciplinary';
  reason: string;
  notes?: string;
}

export interface ParentFilter {
  childId?: ID;
  schoolId?: ID;
  status?: UserStatus;
  search?: string;
}

export interface ParentSummary {
  id: ID;
  name: string;
  email: Email;
  phone?: PhoneNumber;
  avatar?: URL;
  childrenCount: number;
  children: Array<{ id: ID; name: string; school: string }>;
  lastActive?: DateTime;
}
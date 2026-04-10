import type { 
  ID, DateTime, Email, PhoneNumber, URL, Address, 
  EducationLevel, UserStatus,
  Achievement, ParentGuardian
} from './index';
import type { User } from './user.types';

export interface Student extends User {
  role: 'student';
  studentNumber: string;
  currentSchool?: string | any; // School type
  currentClass?: string | any; // Class type
  enrollmentDate: DateTime;
  educationLevel: EducationLevel;
  stream?: string;
  subjects?: string[] | any[]; // Subject[]
  guardians?: ParentGuardian[];
  
  academicStanding?: string;
  cumulativeGPA?: number;
  creditsEarned?: number;
  
  extracurriculars?: string[];
  achievements?: Achievement[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: PhoneNumber;
  email?: Email;
  address?: Address;
  isPrimary: boolean;
}

export interface MedicalInfo {
  bloodGroup?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  doctorName?: string;
  doctorPhone?: PhoneNumber;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface PreviousSchool {
  name: string;
  address?: Address;
  lastGrade: string;
  yearLeft: number;
  reasonForLeaving?: string;
}

export interface StudentEnrollment {
  id: ID;
  studentId: ID;
  studentName: string;
  courseId: ID;
  courseName: string;
  enrollmentDate: DateTime;
  status: 'active' | 'completed' | 'dropped' | 'pending';
  progress: number;
  grade?: number;
  completionDate?: DateTime;
}

export interface StudentAttendance {
  id: ID;
  studentId: ID;
  studentName: string;
  courseId: ID;
  courseName: string;
  date: DateTime;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  reason?: string;
  markedBy: ID;
}

export interface StudentGrade {
  id: ID;
  studentId: ID;
  studentName: string;
  courseId: ID;
  courseName: string;
  assessmentId: ID;
  assessmentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  grade: string;
  feedback?: string;
  submittedAt: DateTime;
  gradedAt?: DateTime;
  gradedBy?: ID;
}

export interface StudentPerformance {
  studentId: ID;
  overallAverage: number;
  currentGPA: number;
  creditsEarned: number;
  creditsAttempted: number;
  rank?: number;
  totalStudents?: number;
  attendanceRate: number;
  subjects: SubjectPerformance[];
  trends: PerformanceTrend[];
}

export interface SubjectPerformance {
  subjectId: ID;
  subjectName: string;
  teacherName: string;
  currentGrade: number;
  previousGrade?: number;
  trend?: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  attendance: number;
}

export interface PerformanceTrend {
  period: string;
  average: number;
  subjects: Record<string, number>;
}

export interface StudentDashboard {
  student: Student;
  enrolledCourses: StudentEnrollment[];
  recentGrades: StudentGrade[];
  upcomingAssignments: Assignment[];
  attendanceSummary: AttendanceSummary;
  announcements: Announcement[];
  notifications: any[]; // Notification[]
}

export interface Assignment {
  id: ID;
  title: string;
  description: string;
  courseId: ID;
  courseName: string;
  dueDate: DateTime;
  totalPoints: number;
  submitted?: boolean;
  grade?: number;
  status: 'pending' | 'submitted' | 'graded' | 'late';
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
  weekly: Array<{
    week: string;
    present: number;
    absent: number;
    late: number;
  }>;
}

export interface Announcement {
  id: ID;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: DateTime;
  expiresAt?: DateTime;
  createdBy: string;
}

export interface StudentFilter {
  grade?: string;
  class?: string;
  stream?: string;
  status?: UserStatus;
  search?: string;
  schoolId?: ID;
  guardianId?: ID;
  dateFrom?: DateTime;
  dateTo?: DateTime;
}

export interface StudentSummary {
  id: ID;
  name: string;
  studentId: string;
  grade: string;
  class?: string;
  avatar?: URL;
  schoolName: string;
  attendance: number;
  averageGrade: number;
  status: UserStatus;
}
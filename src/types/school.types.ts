import type { 
  ID, DateTime, Email, PhoneNumber, URL, Address, 
  SchoolType, VerificationStatus, UserStatus 
} from './index';

export interface School {
  id: ID;
  schoolCode: string;
  name: string;
  formerName?: string;
  
  type: SchoolType;
  ownership: 'government' | 'council' | 'mission' | 'trust' | 'private';
  gender: 'boys' | 'girls' | 'mixed';
  boarding: 'day' | 'boarding' | 'both';
  
  location: Address & {
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  
  headTeacher: SchoolHeadTeacher;
  adminTeam: SchoolAdmin[];
  departments: SchoolDepartment[];
  
  statistics: SchoolStatistics;
  infrastructure: Infrastructure;
  
  facilities: SchoolFacility[];
  accreditation: Accreditation[];
  verificationStatus: VerificationStatus;
  
  status: UserStatus;
  established: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface SchoolHeadTeacher {
  id?: ID;
  name: string;
  email: Email;
  phone: PhoneNumber;
  qualification: string;
  experience: number;
  appointedDate: DateTime;
  userId?: ID;
}

export interface SchoolAdmin {
  id: ID;
  userId?: ID;
  name: string;
  role: 'principal' | 'vice_principal' | 'admin' | 'accountant' | 'librarian' | 'head_of_department';
  email: Email;
  phone: PhoneNumber;
  department?: string;
  startDate?: DateTime;
}

export interface SchoolDepartment {
  id: ID;
  name: string;
  head: string;
  headId?: ID;
  subjects: string[];
  teachers: number;
  students: number;
}

export interface SchoolStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  studentTeacherRatio: number;
  averageClassSize: number;
  passRate?: number;
  graduationRate?: number;
  attendanceRate?: number;
  retentionRate?: number;
}

export interface Infrastructure {
  electricity: boolean;
  water: boolean;
  internet: boolean;
  library: boolean;
  laboratory: boolean;
  sportsFacilities: boolean;
  computerLab: boolean;
  classrooms: number;
}

export interface SchoolFacility {
  id: ID;
  name: string;
  type: 'classroom' | 'lab' | 'library' | 'sports' | 'cafeteria' | 'dormitory' | 'office' | 'hall';
  count: number;
  capacity?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastInspection?: DateTime;
}

export interface Accreditation {
  id: ID;
  name: string;
  issuingBody: string;
  issueDate: DateTime;
  expiryDate: DateTime;
  status: 'active' | 'expired' | 'pending';
  documentUrl?: URL;
}

export interface SchoolDashboard {
  school: School;
  overview: SchoolOverview;
  recentActivities: SchoolActivity[];
  upcomingEvents: SchoolEvent[];
  pendingVerifications: number;
  alerts: SchoolAlert[];
}

export interface SchoolOverview {
  todayAttendance: number;
  weeklyAttendance: number[];
  newEnrollments: number;
  pendingFees: number;
  collectedFees: number;
  upcomingExams: number;
  teacherAttendance: number;
}

export interface SchoolActivity {
  id: ID;
  type: 'enrollment' | 'payment' | 'exam' | 'event' | 'alert' | 'meeting';
  title: string;
  description: string;
  timestamp: DateTime;
  user?: string;
  link?: string;
}

export interface SchoolEvent {
  id: ID;
  title: string;
  description: string;
  date: DateTime;
  type: 'academic' | 'sports' | 'cultural' | 'holiday' | 'meeting' | 'exam';
  participants?: string[];
  location?: string;
}

export interface SchoolAlert {
  id: ID;
  type: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: DateTime;
  actionable: boolean;
  actionUrl?: string;
  expiresAt?: DateTime;
}

export interface SchoolTerm {
  id: ID;
  name: string;
  academicYear: string;
  startDate: DateTime;
  endDate: DateTime;
  holidays: Holiday[];
  isActive: boolean;
}

export interface Holiday {
  id: ID;
  name: string;
  date: DateTime;
  type: 'public' | 'school' | 'exam' | 'sports';
}

export interface SchoolClass {
  id: ID;
  name: string;
  grade: string;
  stream?: string;
  academicYear: string;
  capacity: number;
  enrolled: number;
  homeroomTeacher: TeacherInfo;
  subjects: ClassSubject[];
}

export interface TeacherInfo {
  id: ID;
  name: string;
  email: Email;
  phone?: PhoneNumber;
  avatar?: URL;
}

export interface ClassSubject {
  id: ID;
  name: string;
  code: string;
  teacher: TeacherInfo;
  hoursPerWeek: number;
  textbook?: string;
}

export interface SchoolFilter {
  type?: SchoolType;
  ownership?: string;
  province?: string;
  district?: string;
  status?: UserStatus;
  verification?: 'verified' | 'pending' | 'all';
  search?: string;
}

export interface SchoolSummary {
  id: ID;
  name: string;
  registrationNumber: string;
  type: SchoolType;
  province: string;
  district: string;
  students: number;
  teachers: number;
  passRate: number;
  verificationStatus: VerificationStatus;
  status: UserStatus;
}
import type { 
  ID, DateTime, Email, PhoneNumber, URL,  
  EducationLevel, VerificationStatus, Availability,
  SchoolAffiliation
} from './index';
import type { User } from './user.types';  // ✅ Added 'type' keyword

export interface Tutor extends User {
  role: 'tutor';
  tutorNumber: string;
  qualifications: string[];
  specialization: string[];
  subjects: string[] | any[]; // Subject[]
  teachingLevels: EducationLevel[];
  yearsOfExperience: number;
  
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'freelance';
  schoolAffiliations?: SchoolAffiliation[];
  
  hourlyRate?: number;
  currency?: string;
  averageRating?: number;
  totalReviews?: number;
  totalStudents?: number;
  
  // ✅ Option A: Remove this line (inherits boolean from User)
  // isVerified: VerificationStatus;
  
  // OR ✅ Option B: Rename it to avoid conflict
  verificationStatus?: VerificationStatus;  // Renamed from 'isVerified'
  
  verifiedBy?: string;
  verificationDate?: DateTime;
  
  availability?: Availability[];
}

// Rest of your interfaces remain the same...
export interface Qualification {
  degree: string;
  field: string;
  institution: string;
  year: number;
  grade?: string;
  certificate?: URL;
  verified: boolean;
}

export interface Education {
  id: ID;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  description?: string;
}

export interface Certification {
  id: ID;
  name: string;
  issuingBody: string;
  issueDate: DateTime;
  expiryDate?: DateTime;
  credentialId?: string;
  credentialUrl?: URL;
  verified: boolean;
}

export interface Subject {
  id: ID;
  name: string;
  code: string;
  level: 'primary' | 'secondary' | 'advanced';
  curriculum?: string;
}

export interface TutorCourse {
  id: ID;
  courseId: ID;
  courseName: string;
  role: 'instructor' | 'assistant' | 'guest';
  status: 'active' | 'completed' | 'upcoming';
  startDate: DateTime;
  endDate?: DateTime;
  students: number;
  progress: number;
}

export interface TutorStudent {
  id: ID;
  studentId: ID;
  studentName: string;
  studentAvatar?: URL;
  courseId: ID;
  courseName: string;
  progress: number;
  lastActivity?: DateTime;
  grade?: number;
  attendance: number;
}

export interface TutorPerformance {
  tutorId: ID;
  overallRating: number;
  totalReviews: number;
  completionRate: number;
  studentRetention: number;
  averageClassSize: number;
  coursesTaught: number;
  totalStudents: number;
  totalHours: number;
  earnings: Earnings;
  ratings: RatingDistribution;
  feedback: Feedback[];
}

export interface Earnings {
  total: number;
  pending: number;
  paid: number;
  projected: number;
  currency: string;
  monthly: MonthlyEarnings[];
  byCourse: CourseEarnings[];
}

export interface MonthlyEarnings {
  month: string;
  amount: number;
  courses: number;
  students: number;
}

export interface CourseEarnings {
  courseId: ID;
  courseName: string;
  students: number;
  revenue: number;
  commission: number;
  netEarnings: number;
}

export interface RatingDistribution {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Feedback {
  id: ID;
  studentId: ID;
  studentName: string;
  studentAvatar?: URL;
  rating: number;
  comment: string;
  courseId: ID;
  courseName: string;
  createdAt: DateTime;
  response?: string;
  helpful: number;
}

export interface TutorSchedule {
  id: ID;
  tutorId: ID;
  date: DateTime;
  slots: ScheduledSlot[];
}

export interface ScheduledSlot {
  id: ID;
  startTime: string;
  endTime: string;
  type: 'class' | 'meeting' | 'office_hours' | 'break';
  courseId?: ID;
  courseName?: string;
  studentId?: ID;
  studentName?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: URL;
}

export interface TutorApplication {
  id: ID;
  userId: ID;
  firstName: string;
  lastName: string;
  email: Email;
  phone: PhoneNumber;
  qualifications: Qualification[];
  subjects: string[];
  experience: number;
  motivation: string;
  references: Reference[];
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: DateTime;
  reviewedAt?: DateTime;
  reviewedBy?: ID;
  feedback?: string;
}

export interface Reference {
  name: string;
  position: string;
  organization: string;
  email: Email;
  phone: PhoneNumber;
  relationship: string;
}

export interface TutorFilter {
  department?: string;
  subject?: string;
  qualification?: string;
  isVerified?: boolean;
  minRating?: number;
  schoolId?: ID;
  status?: string;
  search?: string;
}

export interface TutorSummary {
  id: ID;
  name: string;
  tutorId: string;
  avatar?: URL;
  subjects: string[];
  rating: number;
  experience: number;
  schoolName?: string;
  isVerified: boolean;
  hourlyRate?: number;
}
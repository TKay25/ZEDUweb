
// ==============================================
// In src/types/index.ts, add:
export type {
  BaseProps,
} from './component.types';
// ==============================================
// USER ROLES
// ==============================================
export type UserRole = 
  | 'student' 
  | 'tutor' 
  | 'parent' 
  | 'school_admin' 
  | 'ministry' 
  | 'super_admin';

// ==============================================
// USER STATUS
// ==============================================
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

// ==============================================
// VERIFICATION STATUS
// ==============================================
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'expired';

// ==============================================
// GENDER
// ==============================================
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// ==============================================
// EDUCATION LEVEL
// ==============================================
export type EducationLevel = 
  | 'ecd' 
  | 'primary' 
  | 'secondary' 
  | 'a-level' 
  | 'tertiary' 
  | 'vocational' 
  | 'professional';

// ==============================================
// SCHOOL TYPE
// ==============================================
export type SchoolType = 
  | 'ecd' 
  | 'primary' 
  | 'secondary' 
  | 'high_school' 
  | 'college' 
  | 'university' 
  | 'vocational' 
  | 'special';

// ==============================================
// PAYMENT STATUS
// ==============================================
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

// ==============================================
// ATTENDANCE STATUS
// ==============================================
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'holiday' | 'sick';

// ==============================================
// ASSESSMENT TYPE
// ==============================================
export type AssessmentType = 
  | 'quiz' 
  | 'test' 
  | 'exam' 
  | 'assignment' 
  | 'project' 
  | 'practical';

// ==============================================
// QUESTION TYPE
// ==============================================
export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'short_answer' 
  | 'essay' 
  | 'matching' 
  | 'fill_blank' 
  | 'numerical';

// ==============================================
// NOTIFICATION TYPE
// ==============================================
export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'alert';

// ==============================================
// MESSAGE STATUS
// ==============================================
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

// ==============================================
// COMMON UTILITY TYPES
// ==============================================
export type ID = string;
export type DateTime = string;
export type Email = string;
export type PhoneNumber = string;
export type URL = string;
export type Currency = 'USD' | 'ZWL' | 'EUR' | 'GBP' | 'ZAR' | 'BWP' | 'MWK' | 'MZN';
export type Language = 'en' | 'sn' | 'nd' | 'fr' | 'sw' | 'pt' | 'zu' | 'xh';
export type Theme = 'light' | 'dark' | 'system';
export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';
export type Severity = 'info' | 'success' | 'warning' | 'error' | 'critical';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
export type Direction = 'ltr' | 'rtl';
export type Orientation = 'horizontal' | 'vertical';
export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type Justification = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type SortDirection = 'asc' | 'desc' | 'ascending' | 'descending';
export type FilterOperator = 
  | 'eq' | 'neq'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'contains' | 'notContains'
  | 'startsWith' | 'endsWith'
  | 'in' | 'notIn'
  | 'between' | 'notBetween'
  | 'isNull' | 'isNotNull'
  | 'isEmpty' | 'isNotEmpty';

// ==============================================
// COMMON INTERFACES
// ==============================================

export interface Address {
  province: string;
  district?: string;
  city?: string;
  ward?: string;
  village?: string;
  streetAddress?: string;
  postalCode?: string;
  country?: string;
}

export interface Contact {
  email: Email;
  phone?: PhoneNumber;
  alternativePhone?: PhoneNumber;
  website?: URL;
}

export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Availability {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  slots: TimeSlot[];
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: T;
  errors?: any[];
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface Breadcrumb {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  permissions?: string[];
  roles?: UserRole[];
  disabled?: boolean;
  badge?: number | React.ReactNode;
  target?: '_blank' | '_self';
}

export interface AuditLog {
  id: ID;
  action: string;
  userId: ID;
  userName: string;
  resourceType: string;
  resourceId: ID;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: DateTime;
}

// ==============================================
// USER INTERFACES
// ==============================================

export interface User {
  id: string;
  nationalId?: string;
  studentNumber?: string;
  tutorNumber?: string;
  employeeId?: string;
  
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  username?: string;
  
  role: UserRole;
  avatar?: string;
  
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  
  address?: Address;
  
  isVerified: boolean;
  isActive: boolean;
  status: UserStatus;
  
  lastLogin?: string;
  loginCount?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: 'student';
  studentNumber: string;
  currentSchool?: string;
  currentClass?: string;
  enrollmentDate: string;
  educationLevel: EducationLevel;
  stream?: string;
  subjects?: string[];
  guardians?: ParentGuardian[];
  
  academicStanding?: string;
  cumulativeGPA?: number;
  creditsEarned?: number;
  
  extracurriculars?: string[];
  achievements?: Achievement[];
}

export interface Tutor extends User {
  role: 'tutor';
  tutorNumber: string;
  qualifications: string[];
  specialization: string[];
  subjects: string[];
  teachingLevels: EducationLevel[];
  yearsOfExperience: number;
  
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'freelance';
  schoolAffiliations?: SchoolAffiliation[];
  
  hourlyRate?: number;
  currency?: string;
  averageRating?: number;
  totalReviews?: number;
  totalStudents?: number;
  
  isVerifiedStatus: VerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  
  availability?: Availability[];
}

export interface Parent extends User {
  role: 'parent';
  relationship?: string;
  children?: ParentChild[];
  
  emergencyContact?: boolean;
  pickupAuthorized?: boolean;
  
  communicationPreferences?: CommunicationPreferences;
}

export interface SchoolAdmin extends User {
  role: 'school_admin';
  schoolId: string;
  schoolName: string;
  position: string;
  department?: string;
  
  permissions?: string[];
}

export interface MinistryOfficial extends User {
  role: 'ministry';
  employeeId: string;
  department: string;
  position: string;
  jurisdiction?: Jurisdiction;
  
  securityClearance?: number;
  permissions?: string[];
}

export interface ParentGuardian {
  parentId: string;
  relationship: string;
  isPrimary: boolean;
  emergencyContact: boolean;
  pickupAuthorized: boolean;
}

export interface SchoolAffiliation {
  schoolId: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface ParentChild {
  studentId: string;
  relationship: string;
  isPrimaryGuardian: boolean;
}

export interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
}

export interface Jurisdiction {
  level: 'national' | 'provincial' | 'district' | 'cluster';
  province?: string;
  district?: string;
  cluster?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  dateEarned: string;
  type: 'academic' | 'sports' | 'arts' | 'leadership' | 'community';
  badgeUrl?: string;
  certificateUrl?: string;
}

// ==============================================
// AUTHENTICATION INTERFACES
// ==============================================

export interface LoginCredentials {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  role: UserRole;
  
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  username?: string;
  password: string;
  passwordConfirm: string;
  
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  educationLevel?: EducationLevel;
  subjects?: string;
  qualifications?: string;
  teachingLevels?: string[];
  teachingSubjects?: string;
  yearsOfExperience?: number;
  relationship?: string;
  linkedStudentId?: string;
  school_name?: string;
  type?: SchoolType;
  school_code?: string;
  ministry_reg_no?: string;
  location?: string;
  contact_details?: string;
  head_first_name?: string;
  head_last_name?: string;
  head_role?: string;
  institution_name?: string;
  department?: string;
  role_title?: string;
  officer_first_name?: string;
  officer_last_name?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  token: string;
  refreshToken?: string;
  data: {
    user: User;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  password: string;
  passwordConfirm: string;
}

// ==============================================
// ACADEMIC INTERFACES
// ==============================================

export interface School {
  id: string;
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
  
  headTeacher: {
    name: string;
    title: string;
    userId?: string;
    startDate?: string;
  };
  
  statistics: SchoolStatistics;
  infrastructure: Infrastructure;
  
  accreditation: Accreditation;
  verificationStatus: VerificationStatus;
  
  createdAt: string;
  updatedAt: string;
}

export interface SchoolStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  studentTeacherRatio: number;
  passRate?: number;
  graduationRate?: number;
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

export interface Accreditation {
  status: VerificationStatus;
  registrationNumber: string;
  registrationDate: string;
  expiryDate?: string;
  lastInspection?: string;
  nextInspection?: string;
  inspectorNotes?: string;
}

export interface Class {
  id: string;
  schoolId: string;
  className: string;
  academicYear: string;
  
  level: EducationLevel;
  form?: number;
  stream?: string;
  
  classTeacher?: {
    teacherId: string;
    name: string;
    startDate: string;
  };
  
  students: ClassStudent[];
  subjects: ClassSubject[];
  
  roomNumber?: string;
  capacity: number;
  
  statistics: ClassStatistics;
  
  createdAt: string;
  updatedAt: string;
}

export interface ClassStudent {
  studentId: string;
  enrollmentDate: string;
  status: 'active' | 'transferred' | 'dropped';
}

export interface ClassSubject {
  subjectId: string;
  teacherId: string;
  schedule?: Schedule[];
}

export interface Schedule {
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface ClassStatistics {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  averageAge: number;
  attendanceRate: number;
  performanceAverage: number;
}

export interface Subject {
  id: string;
  subjectCode: string;
  name: string;
  alternativeName?: string;
  
  level: EducationLevel[];
  category: 'core' | 'elective' | 'vocational' | 'special';
  
  curriculum: {
    provider: 'zimsec' | 'cambridge' | 'other';
    version: string;
    effectiveDate: string;
  };
  
  description?: string;
  objectives?: string[];
  learningOutcomes?: string[];
  
  assessmentStructure: AssessmentStructure;
  syllabus: Syllabus;
  
  recommendedResources?: Resource[];
  
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentStructure {
  continuousAssessment: number;
  finalExam: number;
  practical?: number;
  coursework?: number;
  total: number;
}

export interface Syllabus {
  documentUrl?: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
  weightage: number;
  estimatedHours: number;
}

export interface Subtopic {
  id: string;
  name: string;
  description?: string;
}

export interface Resource {
  type: 'textbook' | 'online' | 'video' | 'software' | 'equipment';
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  url?: string;
}

// ==============================================
// AI & VIDEO INTERFACES
// ==============================================

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AISession {
  id: string;
  studentId: string;
  messages: AIChatMessage[];
  subject?: string;
  topics: string[];
  duration: number;
  createdAt: string;
}

export interface QuizGenerationRequest {
  content: string;
  numQuestions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionTypes?: QuestionType[];
}

export interface GeneratedQuiz {
  questions: any[];
  totalQuestions: number;
  difficulty: string;
  generatedAt: string;
}

export interface SummaryGenerationRequest {
  content: string;
  length?: 'short' | 'medium' | 'long';
}

export interface GeneratedSummary {
  summary: string;
  length: string;
  generatedAt: string;
}

export interface VideoCallToken {
  token: string;
  appId: string;
  channelName: string;
  uid: number | string;
}

export interface VideoCallRoom {
  roomId: string;
  hostId: string;
  participants: string[];
  settings: VideoCallSettings;
  status: 'active' | 'ended';
  createdAt: string;
}

export interface VideoCallSettings {
  maxParticipants: number;
  allowRecording: boolean;
  allowChat: boolean;
  allowScreenShare: boolean;
}

// ==============================================
// REACT COMPONENT PROPS
// ==============================================

export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
  'aria-label'?: string;
}

export interface WithChildren {
  children?: React.ReactNode;
}

export interface WithIcon {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
}

export interface WithLoading {
  loading?: boolean;
  loadingText?: string;
  skeleton?: boolean;
}

export interface WithError {
  error?: Error | string | null;
  onRetry?: () => void;
}

export interface WithDisabled {
  disabled?: boolean;
}

export interface WithRequired {
  required?: boolean;
}

export interface WithValidation {
  isValid?: boolean;
  isInvalid?: boolean;
  validationMessage?: string;
  validationState?: 'success' | 'error' | 'warning' | 'info';
}

export interface AsProps<T extends React.ElementType = React.ElementType> {
  as?: T;
}

export type PolymorphicProps<T extends React.ElementType, P = {}> = AsProps<T> & 
  Omit<React.ComponentPropsWithoutRef<T>, keyof AsProps<T>> & P;
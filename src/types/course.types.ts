import type { 
  ID, DateTime, URL, EducationLevel, 
   Attachment 
} from './index';

export interface Course {
  id: ID;
  courseCode: string;
  title: string;
  subtitle?: string;
  
  subjectId: ID | any; // Subject
  classLevel: string;
  
  createdBy: ID | any; // Tutor
  authorName: string;
  
  description: string;
  thumbnail?: URL;
  previewVideo?: URL;
  
  lessons: CourseLesson[];
  quizzes: CourseQuiz[];
  assignments: string[] | any[]; // Assignment[]
  
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  language: string;
  captions?: string[];
  
  isFree: boolean;
  price?: number;
  currency?: string;
  discountPrice?: number;
  discountExpiry?: DateTime;
  
  enrollmentCount: number;
  maxStudents?: number;
  enrollmentDeadline?: DateTime;
  enrolledStudents: Enrollment[];
  
  averageRating: number;
  totalRatings: number;
  ratings: Rating[];
  
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived' | 'under_review';
  
  createdAt: DateTime;
  publishedAt?: DateTime;
  updatedAt: DateTime;
}

export interface CourseLesson {
  lessonId: ID | any; // Lesson
  order: number;
  title: string;
  duration: number;
  isFree: boolean;
}

export interface CourseQuiz {
  quizId: ID | any; // Quiz
  title: string;
  order: number;
  passingScore: number;
}

export interface Enrollment {
  studentId: ID | any; // Student
  enrollmentDate: DateTime;
  progress: number;
  completionDate?: DateTime;
  certificateIssued: boolean;
  certificateUrl?: URL;
}

export interface Rating {
  studentId: ID | any; // Student
  rating: number;
  review?: string;
  date: DateTime;
}

export interface Lesson {
  id: ID;
  courseId: ID | any; // Course
  title: string;
  description: string;
  
  contentType: 'video' | 'article' | 'interactive' | 'quiz' | 'assignment' | 'live_session';
  
  videoUrl?: URL;
  videoDuration?: number;
  thumbnail?: URL;
  transcript?: string;
  subtitles?: Subtitle[];
  
  articleContent?: string;
  attachments?: Attachment[];
  
  interactiveUrl?: URL;
  h5pContent?: any;
  
  liveSession?: LiveSession;
  
  resources?: Resource[];
  
  views: number;
  uniqueViews: number;
  averageWatchTime?: number;
  completionRate: number;
  
  isFree: boolean;
  isPublished: boolean;
  order: number;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Subtitle {
  language: string;
  url: URL;
}

export interface LiveSession {
  scheduledDate: DateTime;
  startTime: string;
  endTime: string;
  meetingUrl: URL;
  recordingUrl?: URL;
  attendees: string[];
}

export interface Resource {
  type: 'textbook' | 'online' | 'video' | 'software' | 'equipment' | 'article';
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  url?: URL;
}

export interface Schedule {
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface Subject {
  id: ID;
  subjectCode: string;
  name: string;
  alternativeName?: string;
  
  level: EducationLevel[];
  category: 'core' | 'elective' | 'vocational' | 'special';
  
  curriculum: {
    provider: 'zimsec' | 'cambridge' | 'other';
    version: string;
    effectiveDate: DateTime;
  };
  
  description?: string;
  objectives?: string[];
  learningOutcomes?: string[];
  
  assessmentStructure: AssessmentStructure;
  syllabus: Syllabus;
  
  recommendedResources?: Resource[];
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface AssessmentStructure {
  continuousAssessment: number;
  finalExam: number;
  practical?: number;
  coursework?: number;
  total: number;
}

export interface Syllabus {
  documentUrl?: URL;
  topics: Topic[];
}

export interface Topic {
  id: ID;
  name: string;
  subtopics: Subtopic[];
  weightage: number;
  estimatedHours: number;
}

export interface Subtopic {
  id: ID;
  name: string;
  description?: string;
}
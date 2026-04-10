export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrolledStudents: number;
  category: string;
  nextLesson?: {
    id: string;
    title: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  duration: number;
  videoUrl?: string;
  content?: string;
  completed: boolean;
  order: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: Date;
  points: number;
  status: 'pending' | 'submitted' | 'graded';
  submission?: {
    submittedAt: Date;
    content?: string;
    fileUrl?: string;
    grade?: number;
    feedback?: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  timeLimit: number;
  questions: number;
  passingScore: number;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  lastAttempt?: Date;
}

export interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  assignmentId?: string;
  quizId?: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: Date;
  gradedAt?: Date;
  feedback?: string;
}

export interface StudentStats {
  coursesInProgress: number;
  completedCourses: number;
  averageGrade: number;
  totalPoints: number;
  rank: number;
  totalStudents: number;
}
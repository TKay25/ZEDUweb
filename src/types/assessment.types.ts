import type { 
  ID, DateTime, Attachment 
} from './index';

// In assessment.types.ts, add 'export' before QuestionType
export type QuestionType = 
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'essay'
  | 'matching'
  | 'fill_blank'
  | 'numerical';

export interface Assignment {
  id: ID;
  assignmentCode: string;
  title: string;
  description: string;
  
  courseId?: ID | any; // Course
  lessonId?: ID | any; // Lesson
  classId?: ID | any; // Class
  subjectId?: ID | any; // Subject
  createdBy: ID | any; // Tutor
  
  type: 'homework' | 'project' | 'essay' | 'presentation' | 'practical' | 'research';
  
  instructions: string;
  attachments: Attachment[];
  
  rubric?: Rubric;
  
  totalPoints: number;
  passingPoints: number;
  gradingType: 'points' | 'percentage' | 'letter' | 'pass_fail';
  
  issuedDate: DateTime;
  dueDate: DateTime;
  submissionDeadline: DateTime;
  lateSubmissionPolicy: LateSubmissionPolicy;
  
  maxSubmissions: number;
  allowResubmission: boolean;
  groupSubmission: boolean;
  maxGroupSize?: number;
  
  assignedStudents: string[];
  submittedCount: number;
  gradedCount: number;
  averageScore: number;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Rubric {
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  criterion: string;
  description: string;
  maxPoints: number;
  weightage: number;
}

export interface LateSubmissionPolicy {
  allowed: boolean;
  penalty?: number;
  deadlineExtension?: DateTime;
}

export interface Submission {
  id: ID;
  assignmentId: ID | any; // Assignment
  studentId: ID | any; // Student
  
  submissionType: 'file' | 'text' | 'link' | 'mixed';
  content: SubmissionContent;
  
  submissionDate: DateTime;
  isLate: boolean;
  latePenalty?: number;
  
  groupSubmissionId?: string;
  groupMembers?: string[];
  
  grade?: Grade;
  rubricScores?: RubricScore[];
  
  plagiarismScore?: number;
  plagiarismReport?: string;
  
  isResubmission: boolean;
  originalSubmissionId?: string;
  resubmissionNumber: number;
  
  status: 'draft' | 'submitted' | 'late' | 'graded' | 'returned' | 'resubmitted';
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface SubmissionContent {
  text?: string;
  files?: Attachment[];
  links?: Link[];
}

export interface Link {
  url: string;
  description?: string;
}

export interface Grade {
  points?: number;
  percentage?: number;
  letter?: string;
  passed?: boolean;
  feedback?: string;
  annotatedFile?: string;
  gradedBy: ID | any; // Tutor
  gradedDate: DateTime;
}

export interface RubricScore {
  criterion: string;
  score: number;
  comments?: string;
}

export interface Quiz {
  id: ID;
  quizCode: string;
  title: string;
  description: string;
  
  courseId?: ID | any; // Course
  lessonId?: ID | any; // Lesson
  createdBy: ID | any; // Tutor
  
  quizType: 'practice' | 'graded' | 'placement' | 'diagnostic' | 'final';
  
  questions: QuizQuestion[];
  
  timeLimit?: number;
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showAnswers: 'never' | 'after_submission' | 'after_deadline' | 'immediately';
  
  passingScore: number;
  isProctored: boolean;
  
  availableFrom?: DateTime;
  availableUntil?: DateTime;
  
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface QuizQuestion {
  id: ID;
  questionType: QuestionType;
  questionText: string;
  questionMedia?: QuestionMedia;
  points: number;
  
  options?: MCQOption[];
  correctAnswer?: boolean | string | string[];
  acceptableAnswers?: string[];
  caseSensitive?: boolean;
  pairs?: MatchingPair[];
  blanks?: Blank[];
  correctValue?: number;
  tolerance?: number;
  unit?: string;
  rubric?: string;
  wordLimit?: number;
  
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface QuestionMedia {
  image?: string;
  audio?: string;
  video?: string;
}

export interface MCQOption {
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Blank {
  position: number;
  correctAnswer: string;
  alternatives?: string[];
}

export interface QuizAttempt {
  id: ID;
  quizId: ID | any; // Quiz
  studentId: ID | any; // Student
  
  attemptNumber: number;
  startTime: DateTime;
  endTime?: DateTime;
  timeSpent?: number;
  
  answers: QuizAnswer[];
  
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  passed: boolean;
  
  proctoringData?: ProctoringData;
  
  status: 'in_progress' | 'completed' | 'timed_out' | 'abandoned';
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface QuizAnswer {
  questionId: string;
  studentAnswer: any;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  feedback?: string;
  timeSpent?: number;
}

export interface ProctoringData {
  ipAddress: string;
  deviceInfo: string;
  browserInfo: string;
  screenCapture?: string[];
  flaggedEvents?: FlaggedEvent[];
}

export interface FlaggedEvent {
  event: string;
  timestamp: string;
}

export interface Exam {
  id: ID;
  name: string;
  type: 'test' | 'midterm' | 'final' | 'quiz' | 'practical';
  term: string;
  academicYear: string;
  
  classId: ID | any; // Class
  subjectId: ID | any; // Subject
  
  date: DateTime;
  startTime: string;
  endTime: string;
  duration: number;
  
  totalMarks: number;
  passMark: number;
  
  venue: string;
  invigilators: Invigilator[];
  
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  
  results?: ExamResults;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Invigilator {
  id: ID;
  name: string;
  email: string;
}

export interface ExamResults {
  published: boolean;
  publishedAt?: DateTime;
  average: number;
  highest: number;
  lowest: number;
  passed: number;
  failed: number;
  distribution: Record<string, number>;
}

export interface ExamSchedule {
  id: ID;
  date: DateTime;
  exams: Exam[];
}
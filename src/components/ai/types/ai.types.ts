// frontend/src/components/ai/types/ai.types.ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  suggestions?: string[];
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface PerformancePrediction {
  subject: string;
  currentScore: number;
  predictedScore: number;
  confidence: number;
  recommendations: string[];
  weakAreas: string[];
  strongAreas: string[];
  timeToImprove: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  type?: 'multiple-choice' | 'true-false' | 'short-answer' | 'coding';
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
  code?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject?: string;
  topic?: string;
  description?: string;
  questions: QuizQuestion[];
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  passingScore?: number;
}

export interface Recommendation {
  id: string;
  type: 'course' | 'resource' | 'activity' | 'career' | 'mentor';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  image?: string;
  tags: string[];
  metadata: {
    duration?: string;
    level?: string;
    rating?: number;
    students?: number;
  };
}

export interface Summary {
  id?: string;
  title: string;
  content: string;
  keyPoints: string[];
  vocabulary?: Array<{ term: string; definition: string }>;
  readingTime?: number;
  source?: { type: string };
  difficulty?: string;
}
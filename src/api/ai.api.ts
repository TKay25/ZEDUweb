// src/api/ai.api.ts
import api from './axios.config';
//import { AxiosResponse } from 'axios';
// ✅ Correct - Type-only import
import type { AxiosResponse } from 'axios';
export interface AIResponse {
  message: string;
  suggestions?: string[];
  confidence?: number;
}

export interface PerformancePrediction {
  predictedGrade: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sessionId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  context?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizGenerationParams {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  questionTypes: ('multiple-choice' | 'true-false' | 'short-answer')[];
  gradeLevel: number;
  subject: string;
  includeExplanations: boolean;
}

export interface GeneratedQuiz {
  title: string;
  description: string;
  questions: {
    id: string;
    text: string;
    type: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation?: string;
    points: number;
  }[];
  totalPoints: number;
  estimatedTime: number;
}

export interface SummaryParams {
  content: string;
  length: 'short' | 'medium' | 'detailed';
  format: 'bullet' | 'paragraph' | 'outline';
  language: string;
  includeKeyTerms: boolean;
}

export interface GeneratedSummary {
  summary: string;
  keyTerms?: {
    term: string;
    definition: string;
  }[];
  mainPoints?: string[];
  readingTime: number;
}

export interface LearningPathParams {
  studentId?: string;
  currentLevel: string;
  goals: string[];
  subjects: string[];
  timeCommitment: number;
  preferredLearningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
}

export interface LearningPath {
  title: string;
  description: string;
  duration: string;
  milestones: {
    title: string;
    description: string;
    courses: string[];
    estimatedTime: string;
  }[];
  resources: {
    type: string;
    title: string;
    url?: string;
  }[];
}

export interface ContentAnalysis {
  readability: {
    score: number;
    level: string;
    suggestions: string[];
  };
  complexity: {
    vocabulary: string[];
    concepts: string[];
    prerequisites: string[];
  };
  engagement: {
    estimatedAttentionSpan: number;
    suggestions: string[];
  };
  accessibility: {
    issues: string[];
    improvements: string[];
  };
}

class AIAPI {
  private static instance: AIAPI;
  
  private constructor() {}
  
  static getInstance(): AIAPI {
    if (!AIAPI.instance) {
      AIAPI.instance = new AIAPI();
    }
    return AIAPI.instance;
  }

  // Chatbot
  async sendMessage(message: string, sessionId?: string): Promise<ChatMessage> {
    try {
      const response: AxiosResponse<ChatMessage> = await api.post('/ai/chat', {
        message,
        sessionId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChatSessions(): Promise<ChatSession[]> {
    try {
      const response: AxiosResponse<ChatSession[]> = await api.get('/ai/chat/sessions');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChatHistory(sessionId: string): Promise<ChatSession> {
    try {
      const response: AxiosResponse<ChatSession> = await api.get(`/ai/chat/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteChatSession(sessionId: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await api.delete(`/ai/chat/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Quiz Generation
  async generateQuiz(params: QuizGenerationParams): Promise<GeneratedQuiz> {
    try {
      const response: AxiosResponse<GeneratedQuiz> = await api.post('/ai/generate/quiz', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateQuizFromContent(content: string, params: Partial<QuizGenerationParams>): Promise<GeneratedQuiz> {
    try {
      const response: AxiosResponse<GeneratedQuiz> = await api.post('/ai/generate/quiz/from-content', {
        content,
        ...params
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Summary Generation
  async generateSummary(params: SummaryParams): Promise<GeneratedSummary> {
    try {
      const response: AxiosResponse<GeneratedSummary> = await api.post('/ai/generate/summary', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async summarizeVideo(videoUrl: string, params: Partial<SummaryParams>): Promise<GeneratedSummary> {
    try {
      const response: AxiosResponse<GeneratedSummary> = await api.post('/ai/generate/summary/video', {
        videoUrl,
        ...params
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Learning Path
  async generateLearningPath(params: LearningPathParams): Promise<LearningPath> {
    try {
      const response: AxiosResponse<LearningPath> = await api.post('/ai/generate/learning-path', params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async personalizeLearningPath(pathId: string, feedback: any): Promise<LearningPath> {
    try {
      const response: AxiosResponse<LearningPath> = await api.put(`/ai/learning-path/${pathId}`, { feedback });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Content Analysis
  async analyzeContent(content: string): Promise<ContentAnalysis> {
    try {
      const response: AxiosResponse<ContentAnalysis> = await api.post('/ai/analyze/content', { content });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Question Answering
  async askQuestion(question: string, context: string): Promise<{ answer: string; confidence: number }> {
    try {
      const response: AxiosResponse<{ answer: string; confidence: number }> = await api.post('/ai/ask', {
        question,
        context
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Translation
  async translateText(text: string, targetLanguage: string): Promise<{ translatedText: string }> {
    try {
      const response: AxiosResponse<{ translatedText: string }> = await api.post('/ai/translate', {
        text,
        targetLanguage
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Personalized Recommendations
  async getRecommendations(userId: string, context: string): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await api.get(`/ai/recommendations/${userId}`, {
        params: { context }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data?.message || 'AI API error');
    }
    return new Error('Network error');
  }
}

export default AIAPI.getInstance();
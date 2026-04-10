import type { ID, DateTime } from './index';
import type { QuestionType } from './assessment.types';

// ==============================================
// AI SERVICE TYPES
// ==============================================

export interface AIChatMessage {
  id?: ID;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: DateTime;
  metadata?: AIChatMetadata;
}

export interface AIChatMetadata {
  tokens?: number;
  processingTime?: number;
  model?: string;
  confidence?: number;
  sources?: AISource[];
  suggestions?: string[];
}

export interface AISource {
  title: string;
  url?: string;
  content?: string;
  relevance?: number;
}

export interface AISession {
  id: ID;
  userId: ID;
  userRole: string;
  subject?: string;
  topic?: string;
  messages: AIChatMessage[];
  context?: AIContext;
  startedAt: DateTime;
  endedAt?: DateTime;
  duration?: number;
  status: 'active' | 'paused' | 'completed' | 'expired';
  feedback?: AISessionFeedback;
  metadata?: Record<string, any>;
}

export interface AIContext {
  courseId?: ID;
  lessonId?: ID;
  assignmentId?: ID;
  quizId?: ID;
  studentId?: ID;
  grade?: string;
  previousTopics?: string[];
  learningObjectives?: string[];
  userPreferences?: Record<string, any>;
}

export interface AISessionFeedback {
  rating?: number;
  helpful?: boolean;
  comment?: string;
  wouldUseAgain?: boolean;
  timestamp: DateTime;
}

export interface AIChatRequest {
  message: string;
  sessionId?: ID;
  context?: AIContext;
  options?: AIChatOptions;
}

export interface AIChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  model?: string;
  language?: string;
  tone?: 'formal' | 'casual' | 'encouraging' | 'professional';
  includeSources?: boolean;
  stopSequences?: string[];
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIChatResponse {
  id: ID;
  message: AIChatMessage;
  sessionId: ID;
  suggestions?: string[];
  relatedTopics?: string[];
  actions?: AIAction[];
  metadata?: AIChatMetadata;
}

export interface AIAction {
  type: 'explain' | 'quiz' | 'summarize' | 'practice' | 'example' | 'resource';
  label: string;
  data?: any;
}

// ==============================================
// QUIZ GENERATION TYPES
// ==============================================

export interface QuizGenerationRequest {
  content: string;
  topic?: string;
  subject?: string;
  grade?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  numQuestions?: number;
  questionTypes?: QuestionType[];
  includeExplanations?: boolean;
  language?: string;
  assessmentType?: 'formative' | 'summative' | 'diagnostic' | 'practice';
  timeLimit?: number;
  totalPoints?: number;
  passingScore?: number;
  context?: AIContext;
  options?: QuizGenerationOptions;
}

export interface QuizGenerationOptions {
  temperature?: number;
  creativity?: 'low' | 'medium' | 'high';
  strictAdherence?: boolean;
  includeDistractors?: boolean;
  distractorCount?: number;
  questionFormat?: 'standard' | 'conceptual' | 'application' | 'analysis';
  vocabularyLevel?: 'basic' | 'intermediate' | 'advanced';
}

export interface GeneratedQuiz {
  id: ID;
  title: string;
  description?: string;
  subject?: string;
  topic?: string;
  grade?: string;
  difficulty: string;
  questions: GeneratedQuestion[];
  totalQuestions: number;
  totalPoints: number;
  estimatedTime: number;
  generatedAt: DateTime;
  metadata: QuizGenerationMetadata;
}

export interface GeneratedQuestion {
  id: ID;
  type: QuestionType;
  questionText: string;
  options?: GeneratedOption[];
  correctAnswer?: string | string[] | boolean;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  learningObjective?: string;
  hints?: string[];
  metadata?: QuestionGenerationMetadata;
}

export interface GeneratedOption {
  text: string;
  isCorrect: boolean;
  feedback?: string;
  id?: string;
}

export interface QuestionGenerationMetadata {
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  conceptualComplexity?: number;
  discriminator?: number;
  distractors?: string[];
  sourceSnippet?: string;
}

export interface QuizGenerationMetadata {
  model: string;
  processingTime: number;
  tokensUsed: number;
  confidence: number;
  topicsCovered: string[];
  learningObjectives: string[];
  suggestedPrerequisites?: string[];
  suggestedNext?: string[];
}

// ==============================================
// SUMMARY GENERATION TYPES
// ==============================================

export interface SummaryGenerationRequest {
  content: string;
  title?: string;
  type?: 'article' | 'lesson' | 'chapter' | 'concept' | 'notes';
  length?: 'short' | 'medium' | 'long' | 'detailed';
  format?: 'paragraph' | 'bullet_points' | 'outline' | 'mind_map' | 'key_points';
  audience?: 'student' | 'teacher' | 'parent' | 'general';
  language?: string;
  includeKeyTerms?: boolean;
  includeExamples?: boolean;
  maxPoints?: number;
  context?: AIContext;
  options?: SummaryGenerationOptions;
}

export interface SummaryGenerationOptions {
  temperature?: number;
  focus?: 'comprehensive' | 'key_points' | 'simplified' | 'academic';
  preserveQuotes?: boolean;
  preserveStatistics?: boolean;
  highlightConnections?: boolean;
  vocabularyLevel?: 'basic' | 'intermediate' | 'advanced' | 'academic';
}

export interface GeneratedSummary {
  id: ID;
  title?: string;
  summary: string;
  type: string;
  length: string;
  format: string;
  keyTerms?: KeyTerm[];
  examples?: Example[];
  connections?: ConceptConnection[];
  statistics?: SummaryStatistics;
  metadata: SummaryGenerationMetadata;
  generatedAt: DateTime;
}

export interface KeyTerm {
  term: string;
  definition: string;
  importance: 'high' | 'medium' | 'low';
  page?: number;
  context?: string;
}

export interface Example {
  text: string;
  explanation?: string;
  source?: string;
  relevance?: number;
}

export interface ConceptConnection {
  conceptA: string;
  conceptB: string;
  relationship: string;
  description?: string;
}

export interface SummaryStatistics {
  originalLength: number;
  summarizedLength: number;
  reductionRatio: number;
  sentenceCount: number;
  readabilityScore?: number;
  gradeLevel?: string;
}

export interface SummaryGenerationMetadata {
  model: string;
  processingTime: number;
  tokensUsed: number;
  compressionRatio: number;
  contentCoverage: number;
  keyPointsCovered: string[];
}

// ==============================================
// RECOMMENDATION TYPES
// ==============================================

export interface RecommendationRequest {
  userId: ID;
  userRole: string;
  context?: 'dashboard' | 'course' | 'lesson' | 'assignment' | 'general';
  limit?: number;
  categories?: string[];
  excludeIds?: ID[];
  personalization?: 'high' | 'medium' | 'low';
  options?: RecommendationOptions;
}

export interface RecommendationOptions {
  includeViewed?: boolean;
  includeCompleted?: boolean;
  diversity?: number;
  recency?: boolean;
  collaborative?: boolean;
  contentBased?: boolean;
  hybridWeight?: number;
}

export interface RecommendationResponse<T = any> {
  items: RecommendedItem<T>[];
  total: number;
  strategy: string;
  personalized: boolean;
  metadata: RecommendationMetadata;
}

export interface RecommendedItem<T = any> {
  id: ID;
  type: 'course' | 'lesson' | 'resource' | 'tutor' | 'article' | 'video' | 'path';
  title: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  score: number;
  relevance: number;
  reasons: string[];
  item: T;
  metadata?: ItemMetadata;
}

export interface ItemMetadata {
  popularity?: number;
  rating?: number;
  enrollments?: number;
  completionRate?: number;
  averageTime?: number;
  difficulty?: string;
  duration?: number;
  tags?: string[];
}

export interface RecommendationMetadata {
  model: string;
  processingTime: number;
  userProfile: UserProfileSummary;
  candidatesConsidered: number;
  diversityScore: number;
  coverageScore: number;
}

export interface UserProfileSummary {
  interests: string[];
  skillLevels: Record<string, string>;
  completedItems: number;
  averageRating: number;
  preferredCategories: string[];
  recentActivity: string[];
}

// ==============================================
// PERFORMANCE PREDICTION TYPES
// ==============================================

export interface PerformancePredictionRequest {
  studentId: ID;
  courseId?: ID;
  subjectId?: ID;
  assessmentType?: string;
  timeframe?: 'short' | 'medium' | 'long';
  includeFactors?: boolean;
  includeRecommendations?: boolean;
  options?: PredictionOptions;
}

export interface PredictionOptions {
  modelType?: 'regression' | 'classification' | 'time_series';
  confidence?: number;
  historicalPeriods?: number;
  featureImportance?: boolean;
  scenarioAnalysis?: boolean;
}

export interface PerformancePrediction {
  studentId: ID;
  studentName: string;
  predictions: ScorePrediction[];
  overallPrediction: OverallPrediction;
  riskFactors: RiskFactor[];
  opportunities: Opportunity[];
  recommendations: string[];
  confidence: number;
  metadata: PredictionMetadata;
  generatedAt: DateTime;
}

export interface ScorePrediction {
  assessmentId?: ID;
  assessmentName?: string;
  subject?: string;
  predictedScore: number;
  confidenceInterval: [number, number];
  probabilityRange: Record<string, number>;
  factors: PredictionFactor[];
  dueDate?: DateTime;
}

export interface OverallPrediction {
  predictedGPA: number;
  predictedRank?: number;
  predictedGrade?: string;
  probabilityPass: number;
  probabilityDistinction: number;
  probabilityFail: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface PredictionFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
  actionable: boolean;
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  description: string;
  mitigation?: string;
}

export interface Opportunity {
  area: string;
  potentialImprovement: number;
  effort: 'low' | 'medium' | 'high';
  description: string;
  resources?: string[];
}

export interface PredictionMetadata {
  model: string;
  version: string;
  accuracy: number;
  trainingDataSize: number;
  featuresUsed: string[];
  featureImportance: Record<string, number>;
  asOfDate: DateTime;
}

// ==============================================
// AI TUTOR TYPES
// ==============================================

export interface AITutorSession {
  id: ID;
  studentId: ID;
  studentName: string;
  subject?: string;
  topic?: string;
  mode: 'explain' | 'practice' | 'quiz' | 'homework' | 'review';
  messages: AITutorMessage[];
  context: AITutorContext;
  startedAt: DateTime;
  lastActiveAt: DateTime;
  duration: number;
  progress: AITutorProgress;
  status: 'active' | 'paused' | 'completed';
}

export interface AITutorMessage {
  id: ID;
  role: 'student' | 'tutor' | 'system';
  content: string;
  timestamp: DateTime;
  type: 'text' | 'question' | 'hint' | 'explanation' | 'feedback' | 'correction';
  attachments?: AITutorAttachment[];
  metadata?: AITutorMessageMetadata;
}

export interface AITutorAttachment {
  type: 'image' | 'link' | 'resource' | 'equation' | 'code';
  url?: string;
  content?: string;
  title?: string;
}

export interface AITutorMessageMetadata {
  difficulty?: string;
  confidence?: number;
  learningObjective?: string;
  concept?: string;
  hintsRemaining?: number;
  suggestedActions?: string[];
}

export interface AITutorContext {
  currentConcept?: string;
  masteredConcepts?: string[];
  strugglingConcepts?: string[];
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  pace?: 'slow' | 'medium' | 'fast';
  preferences?: Record<string, any>;
  history?: AITutorHistory[];
}

export interface AITutorHistory {
  concept: string;
  interactions: number;
  successRate: number;
  averageTime: number;
  lastPracticed?: DateTime;
  needsReview: boolean;
}

export interface AITutorProgress {
  conceptsCovered: number;
  conceptsMastered: number;
  overallProgress: number;
  timeSpent: number;
  questionsAnswered: number;
  correctAnswers: number;
  hintsUsed: number;
  score: number;
}

export interface AITutorFeedback {
  helpfulness: number;
  clarity: number;
  pace: number;
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  comments?: string;
  wouldContinue: boolean;
}

// ==============================================
// NLP PROCESSING TYPES
// ==============================================

export interface NLPProcessRequest {
  text: string;
  tasks: NLPProcessorTask[];
  language?: string;
  options?: NLPProcessorOptions;
}

export type NLPProcessorTask = 
  | 'sentiment'
  | 'entities'
  | 'keywords'
  | 'summary'
  | 'questions'
  | 'topics'
  | 'difficulty'
  | 'readability'
  | 'grammar'
  | 'plagiarism'
  | 'translation';

export interface NLPProcessorOptions {
  extractEntities?: boolean;
  extractKeywords?: boolean;
  sentimentAnalysis?: boolean;
  languageDetection?: boolean;
  summarization?: boolean;
  questionGeneration?: boolean;
  difficulty?: 'basic' | 'standard' | 'advanced';
  maxKeywords?: number;
  minScore?: number;
}

export interface NLPProcessResult {
  text: string;
  language?: string;
  sentiment?: SentimentAnalysis;
  entities?: Entity[];
  keywords?: Keyword[];
  summary?: string;
  questions?: string[];
  topics?: Topic[];
  readability?: ReadabilityScore;
  grammar?: GrammarCheck[];
  plagiarism?: PlagiarismCheck;
  translation?: Translation;
  metadata?: NLPProcessMetadata;
}

export interface SentimentAnalysis {
  score: number;
  magnitude: number;
  label: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence: number;
}

export interface Entity {
  text: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'concept' | 'term';
  confidence: number;
  positions: Array<{ start: number; end: number }>;
}

export interface Keyword {
  text: string;
  score: number;
  frequency: number;
}

export interface Topic {
  name: string;
  confidence: number;
  keywords: string[];
}

export interface ReadabilityScore {
  score: number;
  grade: string;
  level: 'easy' | 'medium' | 'hard' | 'expert';
  fleschKincaid: number;
  gunningFog: number;
  colemanLiau: number;
  smog: number;
}

export interface GrammarCheck {
  text: string;
  suggestions: GrammarSuggestion[];
  corrections: GrammarCorrection[];
}

export interface GrammarSuggestion {
  original: string;
  replacement: string;
  explanation: string;
  type: 'spelling' | 'grammar' | 'style' | 'punctuation';
  position: { start: number; end: number };
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  type: string;
  message: string;
}

export interface PlagiarismCheck {
  score: number;
  matches: PlagiarismMatch[];
  originality: number;
  sources: string[];
}

export interface PlagiarismMatch {
  text: string;
  source: string;
  similarity: number;
  url?: string;
}

export interface Translation {
  originalLanguage: string;
  targetLanguage: string;
  translatedText: string;
  confidence: number;
}

export interface NLPProcessMetadata {
  processingTime: number;
  tasksCompleted: string[];
  tokensProcessed: number;
  modelUsed: string;
}
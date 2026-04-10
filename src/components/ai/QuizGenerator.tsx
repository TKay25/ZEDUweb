// src/components/ai/QuizGenerator.tsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
// Fix: Use type-only import
import type { Quiz, QuizQuestion } from './types/ai.types';
import aiAPI from '../../api/ai.api';

// Define the local generated quiz structure
interface LocalGeneratedQuiz {
  title?: string;
  questions: QuizQuestion[];
  [key: string]: any; // For other properties that might come from API
}

interface QuizGeneratorProps {
  onQuizGenerated?: (quiz: Quiz) => void;
  initialData?: Partial<Quiz>;
  className?: string;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  onQuizGenerated,
  initialData = {},
  className = '',
}) => {
  const [step, setStep] = useState<'form' | 'generating' | 'preview' | 'edit'>('form');
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    subject: initialData.subject || '',
    topic: initialData.topic || '',
    description: initialData.description || '',
    difficulty: initialData.difficulty || 'medium',
    numberOfQuestions: 5,
    questionTypes: ['multiple-choice'] as string[],
    includeExplanations: true,
    timeLimit: 30,
    passingScore: 70,
    content: '',
  });

  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
    'Literature',
    'Geography',
    'Economics',
    'Language Learning',
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const questionTypeOptions = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'coding', label: 'Coding Challenge' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter((t) => t !== type)
        : [...prev.questionTypes, type],
    }));
  };

  const handleGenerateQuiz = async () => {
    if (!formData.topic || !formData.subject) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep('generating');

    try {
      let quizData: LocalGeneratedQuiz;

      if (formData.content) {
        // Generate from content
        const response = await aiAPI.generateQuizFromContent(formData.content, {
          difficulty: formData.difficulty as any,
          numberOfQuestions: formData.numberOfQuestions,
          questionTypes: formData.questionTypes as any,
        });
        quizData = response as unknown as LocalGeneratedQuiz;
      } else {
        // Generate from topic
        const response = await aiAPI.generateQuiz({
          topic: formData.topic,
          difficulty: formData.difficulty as any,
          numberOfQuestions: formData.numberOfQuestions,
          questionTypes: formData.questionTypes as any,
          gradeLevel: 10,
          subject: formData.subject,
          includeExplanations: formData.includeExplanations,
        });
        quizData = response as unknown as LocalGeneratedQuiz;
      }

      // Create full Quiz object with id (without createdAt/updatedAt if not in type)
      const fullQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        title: formData.title || `Quiz on ${formData.topic}`,
        subject: formData.subject,
        topic: formData.topic,
        difficulty: formData.difficulty,
        questions: quizData.questions || [],
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        // Remove createdAt and updatedAt if they're not in the Quiz type
        // createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
      };

      setGeneratedQuiz(fullQuiz);
      setStep('preview');
      onQuizGenerated?.(fullQuiz);
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError('Failed to generate quiz. Please try again.');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setStep('form');
    setGeneratedQuiz(null);
  };

  const handleSaveQuiz = () => {
    // Save quiz logic here
    console.log('Saving quiz:', generatedQuiz);
  };

  const renderQuestionPreview = (question: QuizQuestion, index: number) => {
    return (
      <Card key={question.id} variant="outlined" className="mb-4">
        <Card.Body>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge variant="primary">Q{index + 1}</Badge>
              <Badge variant="secondary">{question.difficulty}</Badge>
              <Badge variant="info">{question.type}</Badge>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {question.points} pts
            </span>
          </div>

          <p className="text-gray-900 dark:text-white font-medium mb-3">
            {question.text}
          </p>

          {question.code && (
            <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm mb-3 overflow-x-auto">
              <code>{question.code}</code>
            </pre>
          )}

          {question.options && (
            <div className="space-y-2 mb-3">
              {question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
                    {String.fromCharCode(65 + optIndex)}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </div>
              ))}
            </div>
          )}

          {question.explanation && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-semibold">Explanation:</span> {question.explanation}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (step === 'generating') {
    return (
      <Card className={`text-center py-12 ${className}`}>
        <div className="space-y-4">
          <Spinner size="xl" color="primary" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Generating Your Quiz
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Our AI is creating questions based on your specifications...
            </p>
          </div>
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress" />
          </div>
        </div>
      </Card>
    );
  }

  if (step === 'preview' && generatedQuiz) {
    return (
      <Card className={className}>
        <Card.Header
          title={generatedQuiz.title}
          subtitle={`${generatedQuiz.questions.length} questions • ${generatedQuiz.timeLimit} minutes`}
          action={
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleRegenerate}>
                Regenerate
              </Button>
              <Button onClick={handleSaveQuiz}>Save Quiz</Button>
            </div>
          }
        />

        <Card.Body>
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Subject</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {generatedQuiz.subject}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Topic</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {generatedQuiz.topic}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty</p>
                <Badge variant="primary" size="sm">
                  {generatedQuiz.difficulty}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Passing Score</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {generatedQuiz.passingScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {generatedQuiz.questions.map((question, index) =>
              renderQuestionPreview(question, index)
            )}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Header
        title="AI Quiz Generator"
        subtitle="Create custom quizzes with AI-powered questions"
      />

      <Card.Body>
        {error && (
          <Alert
            variant="error"
            message={error}
            className="mb-4"
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quiz Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Algebra Fundamentals Quiz"
              hint="Leave empty for AI-generated title"
              fullWidth
            />

            <Select
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              options={subjects.map(s => ({ value: s, label: s }))}
              placeholder="Select subject"
              required
              fullWidth
            />
          </div>

          <Input
            label="Topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            placeholder="e.g., Quadratic Equations, Photosynthesis, World War II"
            required
            fullWidth
          />

          <Textarea
            label="Content (Optional)"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Paste your content here to generate questions from it..."
            rows={4}
            hint="Leave empty to generate based on topic only"
            fullWidth
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              options={difficulties}
              fullWidth
            />

            <Input
              label="Number of Questions"
              name="numberOfQuestions"
              type="number"
              value={formData.numberOfQuestions}
              onChange={handleInputChange}
              min={1}
              max={20}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Time Limit (minutes)"
              name="timeLimit"
              type="number"
              value={formData.timeLimit}
              onChange={handleInputChange}
              min={1}
              max={180}
              fullWidth
            />

            <Input
              label="Passing Score (%)"
              name="passingScore"
              type="number"
              value={formData.passingScore}
              onChange={handleInputChange}
              min={0}
              max={100}
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question Types
            </label>
            <div className="flex flex-wrap gap-2">
              {questionTypeOptions.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleQuestionTypeToggle(type.value)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${formData.questionTypes.includes(type.value)
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeExplanations"
              checked={formData.includeExplanations}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, includeExplanations: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="includeExplanations"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Include explanations for answers
            </label>
          </div>

          <div className="pt-4">
            <Button
              type="button"
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              fullWidth
              size="lg"
            >
              {isLoading ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default QuizGenerator;
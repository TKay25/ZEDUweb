import React, { useState } from 'react';
import { 
  Plus, Trash2, Copy, Save, Eye, 
  HelpCircle, Move 
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Tabs } from '../ui/Tabs';
import { toast } from 'react-hot-toast';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
}

interface QuizBuilderProps {
  quiz?: {
    id?: string;
    title: string;
    description: string;
    timeLimit?: number;
    passingScore: number;
    attemptsAllowed: number;
    questions: Question[];
    shuffleQuestions: boolean;
    showAnswers: boolean;
  };
  onSave: (quizData: any) => Promise<void>;
  onCancel: () => void;
}

// Question type options for select
const questionTypeOptions = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'essay', label: 'Essay' }
];

// Tabs configuration
const tabs = [
  { key: 'settings', label: 'Settings' },
  { key: 'questions', label: 'Questions' }
];

export const QuizBuilder: React.FC<QuizBuilderProps> = ({
  quiz,
  onSave,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const [quizData, setQuizData] = useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    timeLimit: quiz?.timeLimit || 30,
    passingScore: quiz?.passingScore || 70,
    attemptsAllowed: quiz?.attemptsAllowed || 3,
    questions: quiz?.questions || [],
    shuffleQuestions: quiz?.shuffleQuestions || false,
    showAnswers: quiz?.showAnswers ?? true
  });

  const [previewMode, setPreviewMode] = useState(false);

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}_${Math.random()}`,
      type,
      question: '',
      points: 10,
      options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'true-false' ? 'true' : '',
      explanation: ''
    };
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[qIndex];
    if (question.options) {
      question.options[oIndex] = value;
      setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
    }
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = { ...quizData.questions[index] };
    questionToDuplicate.id = `q_${Date.now()}_${Math.random()}`;
    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index + 1, 0, questionToDuplicate);
    setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(quizData.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuizData(prev => ({ ...prev, questions: items }));
  };

  const calculateTotalPoints = () => {
    return quizData.questions.reduce((sum, q) => sum + q.points, 0);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate
      if (!quizData.title) {
        toast.error('Quiz title is required');
        return;
      }

      if (quizData.questions.length === 0) {
        toast.error('Add at least one question');
        return;
      }

      // Validate each question
      for (const q of quizData.questions) {
        if (!q.question) {
          toast.error('All questions must have text');
          return;
        }
        if (q.type === 'multiple-choice' && (!q.correctAnswer || (q.correctAnswer as string[]).length === 0)) {
          toast.error('Multiple choice questions need a correct answer');
          return;
        }
      }

      await onSave(quizData);
      toast.success('Quiz saved successfully');
    } catch (error) {
      toast.error('Failed to save quiz');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Preview: {quizData.title}</h2>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            Exit Preview
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">{quizData.title}</h3>
              <p className="text-gray-600 mt-2">{quizData.description}</p>
              <div className="flex items-center space-x-4 mt-4 text-sm">
                <span>Time Limit: {quizData.timeLimit} minutes</span>
                <span>Total Points: {calculateTotalPoints()}</span>
                <span>Passing Score: {quizData.passingScore}%</span>
              </div>
            </div>

            {quizData.questions.map((question, index) => (
              <div key={question.id} className="border-t pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-medium">Question {index + 1}</span>
                    <span className="ml-3 text-sm text-gray-500">
                      ({question.points} points)
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 capitalize">
                    {question.type.replace('-', ' ')}
                  </span>
                </div>
                <p className="mb-3">{question.question}</p>

                {question.type === 'multiple-choice' && question.options && (
                  <div className="space-y-2 ml-4">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`preview-${index}`}
                          className="mr-2"
                        />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div className="space-x-4 ml-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name={`preview-${index}`} className="mr-2" />
                      True
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name={`preview-${index}`} className="mr-2" />
                      False
                    </label>
                  </div>
                )}

                {(question.type === 'short-answer' || question.type === 'essay') && (
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    rows={question.type === 'essay' ? 4 : 2}
                    placeholder={`Enter your ${question.type.replace('-', ' ')} here...`}
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {quiz?.id ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card className="p-6">
          <div className="space-y-4">
            <Input
              label="Quiz Title"
              value={quizData.title}
              onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Chapter 3 Assessment"
            />

            <Textarea
              label="Description"
              value={quizData.description}
              onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide instructions for students..."
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Time Limit (minutes)"
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => setQuizData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                min={1}
              />

              <Input
                label="Passing Score (%)"
                type="number"
                value={quizData.passingScore}
                onChange={(e) => setQuizData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                min={0}
                max={100}
              />

              <Input
                label="Attempts Allowed"
                type="number"
                value={quizData.attemptsAllowed}
                onChange={(e) => setQuizData(prev => ({ ...prev, attemptsAllowed: parseInt(e.target.value) }))}
                min={1}
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={quizData.shuffleQuestions}
                  onChange={(e) => setQuizData(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                  className="mr-2"
                />
                Shuffle questions
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={quizData.showAnswers}
                  onChange={(e) => setQuizData(prev => ({ ...prev, showAnswers: e.target.checked }))}
                  className="mr-2"
                />
                Show correct answers after submission
              </label>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Total Questions: {quizData.questions.length}</span>
                <span>Total Points: {calculateTotalPoints()}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Add Question Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => addQuestion('multiple-choice')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Multiple Choice
            </Button>
            <Button
              variant="outline"
              onClick={() => addQuestion('true-false')}
            >
              True/False
            </Button>
            <Button
              variant="outline"
              onClick={() => addQuestion('short-answer')}
            >
              Short Answer
            </Button>
            <Button
              variant="outline"
              onClick={() => addQuestion('essay')}
            >
              Essay
            </Button>
          </div>

          {/* Questions List */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {quizData.questions.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="p-6"
                        >
                          {/* Question Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div {...provided.dragHandleProps}>
                                <Move className="w-5 h-5 text-gray-400 cursor-move" />
                              </div>
                              <span className="font-medium">
                                Question {index + 1}
                              </span>
                              <Select
                                value={question.type}
                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                options={questionTypeOptions}
                                className="w-40"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={question.points}
                                onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                                className="w-20"
                                min={1}
                              />
                              <span className="text-sm">pts</span>
                              
                              <button
                                onClick={() => duplicateQuestion(index)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => deleteQuestion(index)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Question Content */}
                          <div className="space-y-4">
                            <Textarea
                              value={question.question}
                              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                              placeholder="Enter your question here..."
                              rows={2}
                            />

                            {/* Multiple Choice Options */}
                            {question.type === 'multiple-choice' && question.options && (
                              <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                  <div key={oIndex} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={`correct-${index}`}
                                      checked={question.correctAnswer === option}
                                      onChange={() => updateQuestion(index, 'correctAnswer', option)}
                                      className="mr-2"
                                    />
                                    <Input
                                      value={option}
                                      onChange={(e) => updateOption(index, oIndex, e.target.value)}
                                      placeholder={`Option ${oIndex + 1}`}
                                      className="flex-1"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* True/False */}
                            {question.type === 'true-false' && (
                              <div className="space-x-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={question.correctAnswer === 'true'}
                                    onChange={() => updateQuestion(index, 'correctAnswer', 'true')}
                                    className="mr-2"
                                  />
                                  True
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={question.correctAnswer === 'false'}
                                    onChange={() => updateQuestion(index, 'correctAnswer', 'false')}
                                    className="mr-2"
                                  />
                                  False
                                </label>
                              </div>
                            )}

                            {/* Explanation */}
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Explanation (Optional)
                              </label>
                              <Textarea
                                value={question.explanation || ''}
                                onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                                placeholder="Explain why this answer is correct..."
                                rows={2}
                              />
                            </div>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {quizData.questions.length === 0 && (
            <Card className="p-12 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Questions Yet</h3>
              <p className="text-gray-500 mb-4">
                Click one of the buttons above to add your first question
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Cancel Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
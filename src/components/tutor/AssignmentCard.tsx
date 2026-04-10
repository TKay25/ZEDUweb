import React, { useState } from 'react';
import { 
  XCircle, Download, 
  ChevronLeft, ChevronRight, Save, FileText,
  Clock, User
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Tabs } from '../ui/Tabs';
import { toast } from 'react-hot-toast';

interface Submission {
  id: string;
  student: {
    id: string;
    name: string;
    avatar?: string;
  };
  submittedAt: Date;
  content: string;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  status: 'pending' | 'graded' | 'late';
  grade?: {
    points: number;
    totalPoints: number;
    percentage: number;
    feedback: string;
    gradedAt: Date;
    gradedBy: string;
  };
}

interface AssignmentGraderProps {
  assignment: {
    id: string;
    title: string;
    totalPoints: number;
    rubric?: Array<{
      criterion: string;
      points: number;
      description: string;
    }>;
  };
  submissions: Submission[];
  currentSubmissionIndex: number;
  onGrade: (submissionId: string, grade: { points: number; feedback: string }) => Promise<void>;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

export const AssignmentGrader: React.FC<AssignmentGraderProps> = ({
  assignment,
  submissions,
  currentSubmissionIndex,
  onGrade,
  onNext,
  onPrevious,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState({
    points: submissions[currentSubmissionIndex]?.grade?.points || 0,
    feedback: submissions[currentSubmissionIndex]?.grade?.feedback || ''
  });
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('submission');

  const currentSubmission = submissions[currentSubmissionIndex];
  const totalGraded = submissions.filter(s => s.status === 'graded').length;
  const remaining = submissions.length - totalGraded;

  // Tabs configuration
  const tabs = [
    { key: 'submission', label: 'Submission' },
    { key: 'attachments', label: 'Attachments' }
  ];

  const handleRubricScoreChange = (criterion: string, points: number) => {
    setRubricScores(prev => ({ ...prev, [criterion]: points }));
    
    // Calculate total from rubric
    const total = Object.values({ ...rubricScores, [criterion]: points }).reduce((a, b) => a + b, 0);
    setGrade(prev => ({ ...prev, points: total }));
  };

  const handleSubmitGrade = async () => {
    try {
      setLoading(true);
      await onGrade(currentSubmission.id, grade);
      toast.success('Grade submitted successfully');
      
      // Move to next submission
      if (currentSubmissionIndex < submissions.length - 1) {
        onNext();
        // Reset grade for next submission
        const nextSubmission = submissions[currentSubmissionIndex + 1];
        setGrade({
          points: nextSubmission.grade?.points || 0,
          feedback: nextSubmission.grade?.feedback || ''
        });
      }
    } catch (error) {
      toast.error('Failed to submit grade');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!currentSubmission) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{assignment.title}</h2>
            <p className="text-gray-600">
              Grading submission {currentSubmissionIndex + 1} of {submissions.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="font-semibold">
                {totalGraded} graded • {remaining} remaining
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Student Submission */}
          <div className="w-1/2 border-r overflow-y-auto p-6">
            {/* Student Info */}
            <div className="flex items-center mb-6">
              {currentSubmission.student.avatar ? (
                <img
                  src={currentSubmission.student.avatar}
                  alt={currentSubmission.student.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-100 rounded-full mr-4 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{currentSubmission.student.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Submitted {new Date(currentSubmission.submittedAt).toLocaleString()}
                </div>
              </div>
              {currentSubmission.status === 'late' && (
                <span className="ml-auto px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                  Late Submission
                </span>
              )}
            </div>

            {/* Tabs */}
            <Tabs
              items={tabs}
              activeKey={activeTab}
              onChange={setActiveTab}
            />

            {/* Submission Content */}
            {activeTab === 'submission' && (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{currentSubmission.content}</p>
                </div>
              </div>
            )}

            {/* Attachments */}
            {activeTab === 'attachments' && (
              <div className="mt-4 space-y-3">
                {currentSubmission.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Grading */}
          <div className="w-1/2 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4">Grading</h3>

            {/* Rubric */}
            {assignment.rubric && assignment.rubric.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rubric</h4>
                <div className="space-y-3">
                  {assignment.rubric.map((item) => (
                    <div key={item.criterion} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.criterion}</span>
                        <span className="text-sm text-gray-500">
                          {rubricScores[item.criterion] || 0}/{item.points}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <input
                        type="range"
                        min={0}
                        max={item.points}
                        value={rubricScores[item.criterion] || 0}
                        onChange={(e) => handleRubricScoreChange(item.criterion, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grade Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Points (out of {assignment.totalPoints})
              </label>
              <Input
                type="number"
                value={grade.points}
                onChange={(e) => setGrade(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                min={0}
                max={assignment.totalPoints}
                className="w-32"
              />
              <div className="mt-2 text-sm">
                Percentage: {((grade.points / assignment.totalPoints) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Feedback
              </label>
              <Textarea
                value={grade.feedback}
                onChange={(e) => setGrade(prev => ({ ...prev, feedback: e.target.value }))}
                rows={6}
                placeholder="Provide detailed feedback to the student..."
              />
            </div>

            {/* Quick Comments */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Quick Comments
              </label>
              <div className="flex flex-wrap gap-2">
                {['Good work!', 'Needs improvement', 'Excellent analysis', 'Check your calculations'].map((comment) => (
                  <button
                    key={comment}
                    onClick={() => setGrade(prev => ({ 
                      ...prev, 
                      feedback: prev.feedback + (prev.feedback ? '\n' : '') + comment 
                    }))}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                  >
                    {comment}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentSubmissionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                variant="outline"
                onClick={onNext}
                disabled={currentSubmissionIndex === submissions.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="primary"
                onClick={handleSubmitGrade}
                loading={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Grade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
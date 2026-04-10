import React, { useState } from 'react';
import { Download, Send } from 'lucide-react';

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  fileUrl?: string;
  content?: string;
  grade?: number;
  feedback?: string;
}

interface AssignmentGraderProps {
  assignmentId: string;
  assignmentTitle: string;
  submissions: Submission[];
  onGrade: (submissionId: string, grade: number, feedback: string) => void;
  className?: string;
}

const AssignmentGrader: React.FC<AssignmentGraderProps> = ({
  assignmentId: _assignmentId,
  assignmentTitle,
  submissions,
  onGrade,
  className = ''
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const handleGradeSubmit = () => {
    if (selectedSubmission && grade) {
      onGrade(selectedSubmission.id, parseFloat(grade), feedback);
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{assignmentTitle} - Grading</h2>
      </div>

      <div className="grid grid-cols-3 divide-x">
        {/* Submissions List */}
        <div className="col-span-1 p-4">
          <h3 className="font-medium mb-3">Submissions ({submissions.length})</h3>
          <div className="space-y-2">
            {submissions.map(sub => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubmission(sub);
                  setGrade(sub.grade?.toString() || '');
                  setFeedback(sub.feedback || '');
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSubmission?.id === sub.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="font-medium">{sub.studentName}</div>
                <div className="text-sm text-gray-500">
                  Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                </div>
                {sub.grade !== undefined && (
                  <div className="text-sm font-medium text-blue-600 mt-1">
                    Grade: {sub.grade}%
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grading Area */}
        <div className="col-span-2 p-4">
          {selectedSubmission ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedSubmission.studentName}</h3>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
                {selectedSubmission.fileUrl && (
                  <a
                    href={selectedSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                )}
              </div>

              {selectedSubmission.content && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedSubmission.content}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade (0-100)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="ml-2 text-gray-600">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Provide feedback to the student..."
                  />
                </div>

                <button
                  onClick={handleGradeSubmit}
                  disabled={!grade}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Grade
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Select a submission to grade
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentGrader;
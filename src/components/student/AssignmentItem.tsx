import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload,
  Eye,
  MessageCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Image,
  Video,
  Archive,
  FileSpreadsheet,
  File as FileIcon,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import Toast from '../ui/Toast';
import Spinner from '../ui/Spinner';

// Types
export interface AssignmentItemProps {
  id: string;
  title: string;
  courseName: string;
  courseCode?: string;
  description: string;
  dueDate: string | Date;
  totalPoints: number;
  pointsEarned?: number;
  status: 'pending' | 'submitted' | 'graded' | 'late' | 'draft';
  submissionDate?: string | Date;
  feedback?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size?: number;
    type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
  }>;
  resources?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  rubric?: Array<{
    criterion: string;
    points: number;
    earned?: number;
    feedback?: string;
  }>;
  allowLateSubmission?: boolean;
  submissionType?: 'file' | 'text' | 'both';
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
  onView?: (id: string) => void;
  onSubmit?: (id: string, data: any) => void;
  onDownloadResource?: (resourceId: string) => void;
  onViewFeedback?: (id: string) => void;
  onMessageTutor?: (id: string) => void;
  className?: string;
}

// Badge variant type
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'default';

// ProgressBar color type
type ProgressColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';

// Custom Modal Component
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, size = 'md', children }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const AssignmentItem: React.FC<AssignmentItemProps> = ({
  id,
  title,
  courseName,
  courseCode,
  description,
  dueDate,
  totalPoints,
  pointsEarned,
  status,
  submissionDate,
  feedback,
  attachments = [],
  resources = [],
  rubric = [],
  allowLateSubmission = false,
  submissionType = 'both',
  maxFileSize = 10,
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.txt'],
  onView,
  onSubmit: onSubmitProp, // Rename the prop to avoid conflict with the function name
  onDownloadResource,
  onViewFeedback,
  onMessageTutor,
  className = ''
}) => {
  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Computed properties
  const dueDateTime = new Date(dueDate);
  const now = new Date();
  const isOverdue = now > dueDateTime && status === 'pending';
  const canSubmit = status === 'pending' || (status === 'late' && allowLateSubmission);
  const daysRemaining = Math.ceil((dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.ceil((dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  // Get status color and icon
  const getStatusDetails = () => {
    switch (status) {
      case 'graded':
        return {
          color: 'success' as BadgeVariant,
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Graded',
          bgColor: 'bg-green-100 dark:bg-green-900/20'
        };
      case 'submitted':
        return {
          color: 'info' as BadgeVariant,
          icon: <Upload className="w-4 h-4" />,
          label: 'Submitted',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        };
      case 'late':
        return {
          color: 'danger' as BadgeVariant,
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Late',
          bgColor: 'bg-red-100 dark:bg-red-900/20'
        };
      case 'draft':
        return {
          color: 'warning' as BadgeVariant,
          icon: <FileText className="w-4 h-4" />,
          label: 'Draft',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
        };
      default:
        return {
          color: isOverdue ? 'danger' as BadgeVariant : 'default' as BadgeVariant,
          icon: isOverdue ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />,
          label: isOverdue ? 'Overdue' : 'Pending',
          bgColor: isOverdue ? 'bg-red-100 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'
        };
    }
  };

  const statusDetails = getStatusDetails();

  // Get progress bar color
  const getProgressColor = (): ProgressColor => {
    if (daysRemaining < 2) return 'yellow';
    return 'blue';
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size
    const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setToastMessage(`Files exceed maximum size of ${maxFileSize}MB`);
      setToastType('error');
      setShowToast(true);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !allowedFileTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      setToastMessage(`Invalid file type. Allowed: ${allowedFileTypes.join(', ')}`);
      setToastType('error');
      setShowToast(true);
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle submission
  const handleSubmit = async () => {
    if (submissionType === 'file' && selectedFiles.length === 0) {
      setToastMessage('Please select at least one file to submit');
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (submissionType === 'text' && !submissionText.trim()) {
      setToastMessage('Please enter your submission text');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setToastMessage('Assignment submitted successfully!');
      setToastType('success');
      setShowToast(true);
      setShowSubmitModal(false);
      setSubmissionText('');
      setSelectedFiles([]);
      
      // Call onSubmit prop if provided (renamed to onSubmitProp)
      if (onSubmitProp) {
        await onSubmitProp(id, {
          text: submissionText,
          files: selectedFiles
        });
      }
    } catch (error) {
      setToastMessage('Failed to submit assignment. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view assignment
  const handleView = () => {
    onView?.(id);
  };

  // Calculate progress for time remaining (7 days = 100%)
  const calculateProgress = () => {
    const totalDays = 7;
    const progress = ((totalDays - Math.min(daysRemaining, totalDays)) / totalDays) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
        {/* Header */}
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <Badge 
                  variant={statusDetails.color}
                  className="flex items-center gap-1"
                >
                  {statusDetails.icon}
                  <span>{statusDetails.label}</span>
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {courseCode ? `${courseCode}: ${courseName}` : courseName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due: {format(dueDateTime, 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {totalPoints} points
                  {pointsEarned !== undefined && ` • Earned: ${pointsEarned}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Time remaining indicator */}
              {status === 'pending' && !isOverdue && (
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {daysRemaining > 0 
                      ? `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left`
                      : `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} left`
                    }
                  </div>
                  <ProgressBar 
                    value={calculateProgress()}
                    color={getProgressColor()}
                    className="mt-1 w-32"
                  />
                </div>
              )}
              
              <button 
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h4>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {/* Rubric (if available) */}
            {rubric.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Grading Rubric
                </h4>
                <div className="space-y-2">
                  {rubric.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.criterion}
                      </span>
                      <div className="flex items-center gap-4">
                        {item.earned !== undefined && (
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {item.earned} / {item.points}
                          </span>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Max: {item.points} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {resources.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Resources
                </h4>
                <div className="space-y-2">
                  {resources.map((resource) => (
                    <div 
                      key={resource.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(resource.type)}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {resource.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadResource?.(resource.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback (if graded) */}
            {status === 'graded' && feedback && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Tutor Feedback
                  </h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {feedback}
                </p>
              </div>
            )}

            {/* Submitted Attachments */}
            {attachments.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Your Submissions
                </h4>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(attachment.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {attachment.name}
                          </p>
                          {attachment.size && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(attachment.size)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(attachment.url, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(attachment.url, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Date */}
            {submissionDate && (
              <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Submitted: {format(new Date(submissionDate), 'MMM d, yyyy h:mm a')}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={handleView}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>

              {canSubmit && (
                <Button
                  variant="primary"
                  onClick={() => setShowSubmitModal(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {status === 'late' ? 'Submit Late' : 'Submit Assignment'}
                </Button>
              )}

              {status === 'graded' && onViewFeedback && (
                <Button
                  variant="outline"
                  onClick={() => onViewFeedback(id)}
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Feedback
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => onMessageTutor?.(id)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Tutor
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Submit Modal - Using Custom Modal */}
      <CustomModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title={`Submit: ${title}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Submission Type Info */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              {submissionType === 'file' && 'Please upload your assignment file(s).'}
              {submissionType === 'text' && 'Please enter your assignment text below.'}
              {submissionType === 'both' && 'You can either upload files or enter text, or both.'}
            </p>
          </div>

          {/* Text Submission */}
          {(submissionType === 'text' || submissionType === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Answer
              </label>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:bg-gray-700 dark:text-white"
                placeholder="Type your answer here..."
              />
            </div>
          )}

          {/* File Submission */}
          {(submissionType === 'file' || submissionType === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept={allowedFileTypes.join(',')}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Allowed: {allowedFileTypes.join(', ')} (Max: {maxFileSize}MB per file)
                  </span>
                </label>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setShowSubmitModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Assignment'
              )}
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={5000}
        />
      )}
    </>
  );
};

export default AssignmentItem;
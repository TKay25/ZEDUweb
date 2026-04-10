// src/components/student/TaskItem.tsx
import React, { useState } from 'react';
import { 
  CheckCircle, Circle, Clock, Calendar, 
  AlertCircle, FileText, Link as LinkIcon,
  MessageCircle, Paperclip, Star, Trash2,
  Edit2, ChevronDown, ChevronUp, Download
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { format } from 'date-fns';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  progress?: number;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size?: number;
  }>;
  links?: Array<{
    title: string;
    url: string;
  }>;
  points?: number;
  earnedPoints?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskItemProps {
  task: Task;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  onSubmit?: (taskId: string, data: any) => void;
  onDownloadAttachment?: (attachmentId: string) => void;
  compact?: boolean;
  className?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onViewDetails,
  onSubmit,
  onDownloadAttachment,
  compact = false,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isSubmitting] = useState(false);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'overdue': return 'Overdue';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const due = new Date(task.dueDate);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = getDaysRemaining();
  const isOverdue = daysRemaining < 0 && task.status !== 'completed';
  const isDueSoon = daysRemaining >= 0 && daysRemaining <= 2 && task.status !== 'completed';

  const handleStatusToggle = () => {
    if (!onStatusChange) return;
    
    let newStatus: TaskStatus;
    switch (task.status) {
      case 'completed':
        newStatus = 'pending';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      default:
        newStatus = 'completed';
    }
    onStatusChange(task.id, newStatus);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (compact) {
    return (
      <div
        className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${className}`}
        onClick={() => onViewDetails?.(task.id)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusToggle();
            }}
            className="flex-shrink-0"
          >
            {getStatusIcon(task.status)}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
              {task.title}
            </p>
            <p className="text-xs text-gray-500">{task.subject}</p>
          </div>
          <div className="flex items-center space-x-2">
            {task.points && (
              <Badge variant="secondary" size="sm">
                {task.points} pts
              </Badge>
            )}
            <Badge className={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
            {isOverdue && (
              <Badge variant="danger" size="sm">
                Overdue
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={handleStatusToggle}
              className="flex-shrink-0 mt-0.5"
            >
              {getStatusIcon(task.status)}
            </button>
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                <Badge variant="secondary" size="sm">
                  {task.subject}
                </Badge>
                <Badge className={getPriorityColor(task.priority)} size="sm">
                  {task.priority}
                </Badge>
                {task.status !== 'completed' && isOverdue && (
                  <Badge variant="danger" size="sm">
                    Overdue by {Math.abs(daysRemaining)} days
                  </Badge>
                )}
                {task.status !== 'completed' && isDueSoon && !isOverdue && (
                  <Badge variant="warning" size="sm">
                    Due in {daysRemaining} days
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
                {task.points && (
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {task.earnedPoints ? `${task.earnedPoints}/${task.points}` : `${task.points} pts`}
                  </span>
                )}
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Status: {getStatusText(task.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(task.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4 text-gray-500" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm ml-8">
            {task.description}
          </p>
        )}

        {/* Progress Bar */}
        {task.progress !== undefined && task.status !== 'completed' && (
          <div className="mt-3 ml-8">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{task.progress}%</span>
            </div>
            <ProgressBar value={task.progress} color="blue" className="h-1.5" />
          </div>
        )}

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Paperclip className="w-4 h-4 mr-1" />
                  Attachments
                </h4>
                <div className="space-y-2">
                  {task.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        {file.size && (
                          <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadAttachment?.(file.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {task.links && task.links.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-1" />
                  Resources
                </h4>
                <div className="space-y-1">
                  {task.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <LinkIcon className="w-3 h-3 mr-1" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {task.feedback && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-medium text-blue-800">Feedback</h4>
                </div>
                <p className="text-sm text-blue-700">{task.feedback}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails?.(task.id)}
              >
                View Details
              </Button>
              {task.status !== 'completed' && onSubmit && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSubmit(task.id, {})}
                  disabled={isSubmitting}
                >
                  Submit Task
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskItem;
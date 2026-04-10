// src/components/student/CourseCard.tsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import Avatar from '../ui/Avatar';
import type { Course } from './types/student.types';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  variant?: 'grid' | 'list' | 'compact';
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onContinue,
  onViewDetails,
  variant = 'grid',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">½</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  // Check if course is completed (100% progress)
  const isCompleted = course.progress === 100;
  
  // Check if user is enrolled (progress > 0 OR we can add an enrolled flag if needed)
  // For now, we'll consider a course enrolled if progress is defined
  const isEnrolled = course.progress > 0 || course.completedLessons > 0;

  if (variant === 'list') {
    return (
      <div
        className="cursor-pointer"
        onClick={() => onViewDetails?.(course.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card variant="elevated" hoverable className={`flex ${className}`}>
          <div className="w-48 h-32 relative overflow-hidden rounded-l-lg">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110"
            />
            {isCompleted && (
              <div className="absolute top-2 right-2">
                <Badge variant="success">Completed ✓</Badge>
              </div>
            )}
          </div>

          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {course.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{course.category}</span>
                </div>
              </div>
              <Badge variant={getLevelColor(course.level)} size="sm">
                {course.level}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="flex">{renderStars(course.rating)}</div>
                  <span className="text-sm text-gray-500">({course.enrolledStudents})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Avatar
                    size="xs"
                    name={course.instructor.name}
                    src={course.instructor.avatar}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.instructor.name}
                  </span>
                </div>
              </div>

              {isEnrolled ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContinue?.(course.id);
                  }}
                >
                  Continue ({course.progress}%)
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnroll?.(course.id);
                  }}
                >
                  Enroll Now
                </Button>
              )}
            </div>

            {isEnrolled && (
              <div className="mt-3">
                <ProgressBar
                  value={course.progress}
                  color="blue"
                  className="h-1.5"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className="cursor-pointer"
        onClick={() => onViewDetails?.(course.id)}
      >
        <Card variant="elevated" hoverable className={`p-3 ${className}`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {course.title}
              </h4>
              <p className="text-xs text-gray-500">
                {course.completedLessons}/{course.totalLessons} lessons
              </p>
            </div>
            <Badge variant={getLevelColor(course.level)} size="sm">
              {course.progress}%
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div
      className="cursor-pointer"
      onClick={() => onViewDetails?.(course.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card variant="elevated" hoverable className={`group ${className}`}>
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110"
          />
          
          {/* Overlay with quick actions */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEnrolled) {
                    onContinue?.(course.id);
                  } else {
                    onEnroll?.(course.id);
                  }
                }}
              >
                {isEnrolled ? 'Continue' : 'Enroll Now'}
              </Button>
            </div>
          )}

          {/* Level Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant={getLevelColor(course.level)} size="sm">
              {course.level}
            </Badge>
          </div>

          {/* Completed Badge */}
          {isCompleted && (
            <div className="absolute top-2 right-2">
              <Badge variant="success">✓ Completed</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center space-x-2 mb-3">
            <Avatar
              size="xs"
              name={course.instructor.name}
              src={course.instructor.avatar}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.instructor.name}
            </span>
          </div>

          {/* Rating and Students */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <div className="flex">{renderStars(course.rating)}</div>
              <span className="text-sm text-gray-500">{course.rating}</span>
            </div>
            <span className="text-sm text-gray-500">
              {course.enrolledStudents} students
            </span>
          </div>

          {/* Course Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>⏱️ {course.duration}</span>
            <span>📚 {course.totalLessons} lessons</span>
          </div>

          {/* Progress Bar (if enrolled) */}
          {isEnrolled && (
            <div className="mt-3">
              <ProgressBar
                value={course.progress}
                color="blue"
                className="h-1.5"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CourseCard;
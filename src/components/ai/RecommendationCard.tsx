// src/components/ai/RecommendationCard.tsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
// Fix: Remove unused imports
// import Avatar from '../ui/Avatar';
// import ProgressBar from '../ui/ProgressBar';
// Fix: Use type-only import
import type { Recommendation } from './types/ai.types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onView?: (id: string) => void;
  compact?: boolean;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAccept,
  onDismiss,
  onView,
  compact = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const getTypeIcon = () => {
    switch (recommendation.type) {
      case 'course':
        return '📚';
      case 'resource':
        return '📄';
      case 'activity':
        return '🎯';
      case 'career':
        return '💼';
      case 'mentor':
        return '👨‍🏫';
      default:
        return '✨';
    }
  };

  const getConfidenceColor = () => {
    if (recommendation.confidence >= 0.8) return 'success';
    if (recommendation.confidence >= 0.6) return 'warning';
    return 'info';
  };

  const handleAccept = () => {
    setIsAccepted(true);
    onAccept?.(recommendation.id);
  };

  if (compact) {
    return (
      <div
        className={`cursor-pointer ${className}`}
        onClick={() => onView?.(recommendation.id)}
      >
        <Card
          variant="elevated"
          hoverable
          className="p-3"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {recommendation.title}
                </h4>
                <Badge size="sm" variant={getConfidenceColor()}>
                  {Math.round(recommendation.confidence * 100)}% match
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {recommendation.reason}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        variant="elevated"
        hoverable
        className="relative"
      >
        {/* Confidence badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant={getConfidenceColor()}>
            {Math.round(recommendation.confidence * 100)}% Match
          </Badge>
        </div>

        {/* Image or icon */}
        {recommendation.image ? (
          <img
            src={recommendation.image}
            alt={recommendation.title}
            className="w-full h-32 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg flex items-center justify-center">
            <span className="text-4xl text-white">{getTypeIcon()}</span>
          </div>
        )}

        <Card.Body className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {recommendation.title}
              </h3>
              <Badge variant="secondary" size="sm">
                {recommendation.type}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {recommendation.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium mr-2">Why:</span>
              <span>{recommendation.reason}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {recommendation.tags.map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {recommendation.metadata.duration && (
                <div className="text-xs">
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {recommendation.metadata.duration}
                  </span>
                </div>
              )}
              {recommendation.metadata.level && (
                <div className="text-xs">
                  <span className="text-gray-500">Level:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {recommendation.metadata.level}
                  </span>
                </div>
              )}
              {recommendation.metadata.rating && (
                <div className="text-xs">
                  <span className="text-gray-500">Rating:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    ⭐ {recommendation.metadata.rating}
                  </span>
                </div>
              )}
              {recommendation.metadata.students && (
                <div className="text-xs">
                  <span className="text-gray-500">Students:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {recommendation.metadata.students.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Actions overlay */}
      <div
        className={`
          absolute inset-0 bg-black/50 backdrop-blur-sm
          flex items-center justify-center space-x-3
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() => onView?.(recommendation.id)}
        >
          View
        </Button>
        <Button
          variant="success"
          size="sm"
          onClick={handleAccept}
          disabled={isAccepted}
        >
          {isAccepted ? 'Accepted ✓' : 'Accept'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDismiss?.(recommendation.id)}
        >
          Dismiss
        </Button>
      </div>

      {/* Accepted indicator */}
      {isAccepted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-scale-in">
          Added to your plan ✓
        </div>
      )}
    </div>
  );
};

interface RecommendationListProps {
  recommendations: Recommendation[];
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onView?: (id: string) => void;
  layout?: 'grid' | 'list';
  className?: string;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  onAccept,
  onDismiss,
  onView,
  layout = 'grid',
  className = '',
}) => {
  if (recommendations.length === 0) {
    return (
      <Card className={`text-center py-12 ${className}`}>
        <div className="space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No Recommendations Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Complete more courses to get personalized recommendations
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={`
        ${layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-3'
        }
        ${className}
      `}
    >
      {recommendations.map((rec) => (
        <RecommendationCard
          key={rec.id}
          recommendation={rec}
          onAccept={onAccept}
          onDismiss={onDismiss}
          onView={onView}
          compact={layout === 'list'}
        />
      ))}
    </div>
  );
};

export default RecommendationCard;
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Award, Calendar, DollarSign, Users, 
  Clock, FileText, Heart, Share2, ChevronRight 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ScholarshipCardProps {
  scholarship: {
    id: string;
    name: string;
    provider: string;
    providerLogo?: string;
    amount: number;
    amountType: 'full' | 'partial' | 'fixed';
    description: string;
    eligibility: string[];
    requirements: string[];
    deadline: Date;
    field: string[];
    level: string[];
    nationality: string[];
    gender?: 'male' | 'female' | 'any';
    ageRange?: {
      min: number;
      max: number;
    };
    numberOfAwards: number;
    applicationFee?: number;
    isNeedBased: boolean;
    isMeritBased: boolean;
    renewable: boolean;
    renewableDetails?: string;
    documents: string[];
    contactEmail: string;
    website: string;
    applicationUrl: string;
    status: 'open' | 'closing-soon' | 'closed';
    popularity: number;
    saved?: boolean;
  };
  onApply?: (scholarshipId: string) => void;
  onSave?: (scholarshipId: string) => void;
  onShare?: (scholarshipId: string) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onApply,
  onSave,
  onShare
}) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(scholarship.saved || false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closing-soon': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = () => {
    if (scholarship.amountType === 'full') return 'Full Tuition';
    if (scholarship.amountType === 'partial') {
      return `Up to $${scholarship.amount.toLocaleString()}`;
    }
    return `$${scholarship.amount.toLocaleString()}`;
  };

  const isClosingSoon = () => {
    const daysLeft = Math.ceil(
      (new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft <= 7 && daysLeft > 0;
  };

  const isExpired = () => {
    return new Date() > new Date(scholarship.deadline);
  };

  const daysLeft = Math.ceil(
    (new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isClosingSoon() ? 'border-yellow-300' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {scholarship.providerLogo ? (
              <img 
                src={scholarship.providerLogo} 
                alt={scholarship.provider}
                className="w-12 h-12 rounded-lg mr-4 object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-100 rounded-lg mr-4 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{scholarship.name}</h3>
              <p className="text-sm text-gray-600">{scholarship.provider}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(
              isExpired() ? 'closed' : isClosingSoon() ? 'closing-soon' : scholarship.status
            )}>
              {isExpired() ? 'closed' : isClosingSoon() ? 'closing soon' : scholarship.status}
            </Badge>
            <button
              onClick={() => {
                setSaved(!saved);
                onSave?.(scholarship.id);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart 
                className={`w-5 h-5 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-primary-600">
                {formatAmount()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">Awards:</span>
              <span className="ml-1 font-semibold">{scholarship.numberOfAwards}</span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Deadline: {format(new Date(scholarship.deadline), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{daysLeft} days left</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{scholarship.popularity} applicants</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Award className="w-4 h-4 mr-2" />
            <span>{scholarship.isMeritBased ? 'Merit' : ''} {scholarship.isNeedBased ? 'Need' : ''}</span>
          </div>
        </div>

        {/* Eligibility Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {scholarship.level.slice(0, 3).map((level, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {level}
              </Badge>
            ))}
            {scholarship.field.slice(0, 2).map((field, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {field}
              </Badge>
            ))}
            {scholarship.nationality.slice(0, 1).map((country, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {country === 'any' ? 'All Nationalities' : country}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {scholarship.description}
        </p>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Eligibility */}
            <div>
              <h4 className="font-medium mb-2">Eligibility</h4>
              <ul className="space-y-1">
                {scholarship.eligibility.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="font-medium mb-2">Required Documents</h4>
              <ul className="space-y-1">
                {scholarship.documents.map((doc, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <FileText className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Renewable Info */}
            {scholarship.renewable && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Renewable: </span>
                  {scholarship.renewableDetails || 'This scholarship is renewable based on academic performance.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            {expanded ? 'Show less' : 'Show more details'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(scholarship.id)}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApply?.(scholarship.id)}
              disabled={isExpired()}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
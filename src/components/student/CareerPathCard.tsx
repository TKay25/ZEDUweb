import React, { useState } from 'react';
import { 
  Briefcase, TrendingUp, Clock, 
  DollarSign, GraduationCap, ChevronRight,
  Award, Building, ExternalLink, FileText
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface CareerPathCardProps {
  career: {
    id: string;
    title: string;
    industry: string;
    description: string;
    demandLevel: 'high' | 'medium' | 'low';
    salary: {
      entry: number;
      mid: number;
      senior: number;
      currency: string;
    };
    education: {
      level: string;
      field: string;
      certifications?: string[];
    };
    skills: Array<{
      name: string;
      required: boolean;
      match?: number;
    }>;
    outlook: {
      growth: number;
      jobs: number;
      period: string;
    };
    companies: Array<{
      name: string;
      logo?: string;
    }>;
    matchPercentage?: number;
    careerPath: Array<{
      level: string;
      title: string;
      years: number;
      salary: number;
    }>;
    resources: Array<{
      type: 'course' | 'certification' | 'article' | 'video';
      title: string;
      provider: string;
      url: string;
    }>;
  };
  onExplore?: (careerId: string) => void;
  onSave?: (careerId: string) => void;
  onResourceClick?: (resource: any) => void;
}

// ProgressBar color type
type ProgressColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';

export const CareerPathCard: React.FC<CareerPathCardProps> = ({
  career,
  onExplore,
  onSave: _onSave, // Prefix with underscore to indicate intentionally unused
  onResourceClick
}) => {
  const [expanded, setExpanded] = useState(false);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (amount: number, currency: string) => {
    return `${currency}${(amount / 1000).toFixed(0)}k`;
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  // Get progress bar color based on match percentage
  const getProgressColor = (match: number): ProgressColor => {
    if (match >= 70) return 'green';
    return 'yellow';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{career.title}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="w-4 h-4 mr-1" />
              {career.industry}
            </div>
          </div>
          
          {career.matchPercentage && (
            <div className="text-right">
              <div className={`text-2xl font-bold ${getMatchColor(career.matchPercentage)}`}>
                {career.matchPercentage}%
              </div>
              <div className="text-xs text-gray-500">Match</div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Demand</div>
            <Badge className={`mt-1 ${getDemandColor(career.demandLevel)}`}>
              {career.demandLevel}
            </Badge>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Entry Salary</div>
            <div className="font-semibold text-sm">
              {formatSalary(career.salary.entry, career.salary.currency)}
            </div>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Growth</div>
            <div className="font-semibold text-sm text-green-600">
              +{career.outlook.growth}%
            </div>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Jobs</div>
            <div className="font-semibold text-sm">
              {(career.outlook.jobs / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {career.description}
        </p>

        {/* Skills Match */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Skills Match</span>
            {career.matchPercentage && (
              <span className="text-sm text-gray-600">
                {career.skills.filter(s => s.match && s.match > 0).length}/{career.skills.length} matched
              </span>
            )}
          </div>
          <div className="space-y-2">
            {career.skills.slice(0, 4).map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{skill.name}</span>
                  {skill.match !== undefined && (
                    <span className={skill.match >= 70 ? 'text-green-600' : 'text-yellow-600'}>
                      {skill.match}% match
                    </span>
                  )}
                </div>
                {skill.match !== undefined && (
                  <ProgressBar 
                    value={skill.match} 
                    color={getProgressColor(skill.match)}
                    className="h-1.5"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education Required */}
        <div className="flex items-center p-3 bg-primary-50 rounded-lg mb-4">
          <GraduationCap className="w-5 h-5 text-primary-600 mr-3" />
          <div>
            <span className="text-sm font-medium">{career.education.level}</span>
            <span className="text-sm text-gray-600 mx-2">in</span>
            <span className="text-sm">{career.education.field}</span>
          </div>
        </div>

        {/* Top Companies */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Building className="w-4 h-4 mr-1" />
            Top Employers
          </h4>
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            {career.companies.slice(0, 3).map((company, index) => (
              <div key={index} className="flex items-center">
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                    <Building className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <span className="text-sm">{company.name}</span>
              </div>
            ))}
            {career.companies.length > 3 && (
              <span className="text-xs text-gray-500">
                +{career.companies.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Career Path Timeline */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div>
              <h4 className="font-medium mb-3">Career Progression</h4>
              <div className="relative">
                {career.careerPath.map((step, index) => (
                  <div key={index} className="flex mb-4 last:mb-0">
                    <div className="mr-4 relative">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-primary-600" />
                      </div>
                      {index < career.careerPath.length - 1 && (
                        <div className="absolute top-8 left-4 w-0.5 h-12 bg-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h5 className="font-medium">{step.title}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.years} years
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {formatSalary(step.salary, career.salary.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-medium mb-3">Recommended Resources</h4>
              <div className="space-y-2">
                {career.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      onResourceClick?.(resource);
                    }}
                  >
                    <div className="flex items-center">
                      {resource.type === 'course' && <GraduationCap className="w-4 h-4 text-primary-600 mr-3" />}
                      {resource.type === 'certification' && <Award className="w-4 h-4 text-yellow-600 mr-3" />}
                      {resource.type === 'article' && <FileText className="w-4 h-4 text-blue-600 mr-3" />}
                      {resource.type === 'video' && <Clock className="w-4 h-4 text-purple-600 mr-3" />}
                      <div>
                        <p className="text-sm font-medium">{resource.title}</p>
                        <p className="text-xs text-gray-500">{resource.provider}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            {expanded ? 'Show less' : 'View career path'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onExplore?.(career.id)}
          >
            Explore Career
          </Button>
        </div>
      </div>
    </Card>
  );
};
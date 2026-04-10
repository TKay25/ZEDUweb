import React, { useState } from 'react';
import { format } from 'date-fns';
import { Award, Download, Share2, Eye, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface CertificateCardProps {
  certificate: {
    id: string;
    title: string;
    courseName: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId: string;
    imageUrl: string;
    grade: string;
    issuer: {
      name: string;
      logo?: string;
    };
    skills: string[];
    isVerified: boolean;
    downloadUrl: string;
    shareUrl: string;
  };
  onView?: (certificate: any) => void;
  onDownload?: (certificate: any) => void;
  onShare?: (certificate: any) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onView,
  onDownload,
  onShare
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isValid = certificate.expiryDate 
    ? new Date() < new Date(certificate.expiryDate)
    : true;

  return (
    <div
      className="relative overflow-hidden hover:shadow-xl transition-all duration-300 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden">
        {/* Certificate Image */}
        <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-800">
          <img 
            src={certificate.imageUrl} 
            alt={certificate.title}
            className="w-full h-full object-cover opacity-90"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <Award className="w-16 h-16 text-white opacity-75" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {certificate.isVerified ? (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary">Pending</Badge>
            )}
          </div>

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center space-x-3 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => onView?.(certificate)}
              >
                <Eye className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => onDownload?.(certificate)}
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => onShare?.(certificate)}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-1">{certificate.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{certificate.courseName}</p>

          {/* Issuer */}
          <div className="flex items-center mb-3">
            {certificate.issuer.logo ? (
              <img 
                src={certificate.issuer.logo} 
                alt={certificate.issuer.name}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                <Award className="w-3 h-3 text-gray-500" />
              </div>
            )}
            <span className="text-sm text-gray-600">{certificate.issuer.name}</span>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Credential ID:</span>
              <span className="font-mono text-xs">{certificate.credentialId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Issue Date:</span>
              <span>{format(new Date(certificate.issueDate), 'MMM d, yyyy')}</span>
            </div>
            {certificate.expiryDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Expiry Date:</span>
                <span className={!isValid ? 'text-red-600' : ''}>
                  {format(new Date(certificate.expiryDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Grade:</span>
              <span className="font-semibold">{certificate.grade}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {certificate.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {skill}
                </Badge>
              ))}
              {certificate.skills.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{certificate.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onDownload?.(certificate)}
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onShare?.(certificate)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Verification Badge */}
          {!certificate.isVerified && (
            <div className="mt-3 text-center">
              <span className="text-xs text-yellow-600">
                Verification in progress...
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
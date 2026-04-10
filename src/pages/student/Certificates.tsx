import React, { useState, useEffect } from 'react';
import {
  Award, Download, Share2,
  CheckCircle, Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { CertificateCard } from '../../components/student/CertificateCard';

interface Certificate {
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
  metadata?: {
    duration: string;
    credits?: number;
    instructor: string;
  };
}

export const Certificates: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    loadCertificates();
  }, []);

  useEffect(() => {
    filterCertificates();
  }, [searchTerm, selectedYear, certificates]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCertificates([
        {
          id: '1',
          title: 'Advanced Mathematics Certificate',
          courseName: 'Advanced Mathematics',
          issueDate: new Date('2024-02-15'),
          credentialId: 'CERT-MATH-2024-001',
          imageUrl: '/certificates/math.jpg',
          grade: 'A (92%)',
          issuer: {
            name: 'ZEDU Academy',
            logo: '/logos/zedu.png'
          },
          skills: ['Calculus', 'Linear Algebra', 'Differential Equations'],
          isVerified: true,
          downloadUrl: '/downloads/cert-math-2024-001.pdf',
          shareUrl: '/share/cert-math-2024-001',
          metadata: {
            duration: '12 weeks',
            credits: 4,
            instructor: 'Dr. Sarah Johnson'
          }
        },
        {
          id: '2',
          title: 'Physics Fundamentals Certificate',
          courseName: 'Physics Fundamentals',
          issueDate: new Date('2024-01-10'),
          credentialId: 'CERT-PHYS-2024-023',
          imageUrl: '/certificates/physics.jpg',
          grade: 'B+ (88%)',
          issuer: {
            name: 'ZEDU Academy',
            logo: '/logos/zedu.png'
          },
          skills: ['Mechanics', 'Thermodynamics', 'Wave Physics'],
          isVerified: true,
          downloadUrl: '/downloads/cert-phys-2024-023.pdf',
          shareUrl: '/share/cert-phys-2024-023',
          metadata: {
            duration: '10 weeks',
            credits: 3,
            instructor: 'Prof. James Makoni'
          }
        },
        {
          id: '3',
          title: 'Computer Science Essentials',
          courseName: 'Computer Science 101',
          issueDate: new Date('2023-11-20'),
          credentialId: 'CERT-CS-2023-156',
          imageUrl: '/certificates/cs.jpg',
          grade: 'A (95%)',
          issuer: {
            name: 'ZEDU Academy',
            logo: '/logos/zedu.png'
          },
          skills: ['Programming', 'Algorithms', 'Data Structures'],
          isVerified: true,
          downloadUrl: '/downloads/cert-cs-2023-156.pdf',
          shareUrl: '/share/cert-cs-2023-156',
          metadata: {
            duration: '14 weeks',
            credits: 4,
            instructor: 'Eng. Michael Sibanda'
          }
        },
        {
          id: '4',
          title: 'English Literature Certificate',
          courseName: 'English Literature',
          issueDate: new Date('2023-09-05'),
          credentialId: 'CERT-ENG-2023-089',
          imageUrl: '/certificates/english.jpg',
          grade: 'B (82%)',
          issuer: {
            name: 'ZEDU Academy',
            logo: '/logos/zedu.png'
          },
          skills: ['Literary Analysis', 'Critical Thinking', 'Essay Writing'],
          isVerified: true,
          downloadUrl: '/downloads/cert-eng-2023-089.pdf',
          shareUrl: '/share/cert-eng-2023-089',
          metadata: {
            duration: '12 weeks',
            credits: 3,
            instructor: 'Dr. Elizabeth Dube'
          }
        }
      ]);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCertificates = () => {
    let filtered = [...certificates];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.credentialId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(c =>
        c.issueDate.getFullYear().toString() === selectedYear
      );
    }

    setFilteredCertificates(filtered);
  };

  const getYears = () => {
    const years = new Set(certificates.map(c => c.issueDate.getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  };

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    window.open(certificate.downloadUrl, '_blank');
  };

  const handleShareCertificate = (certificate: Certificate) => {
    if (navigator.share) {
      navigator.share({
        title: certificate.title,
        text: `Check out my certificate: ${certificate.title}`,
        url: certificate.shareUrl
      });
    } else {
      navigator.clipboard.writeText(certificate.shareUrl);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-1">
          View and download your earned certificates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Certificates</p>
          <p className="text-2xl font-bold text-blue-600">{certificates.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">This Year</p>
          <p className="text-2xl font-bold text-green-600">
            {certificates.filter(c => c.issueDate.getFullYear() === new Date().getFullYear()).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Skills Acquired</p>
          <p className="text-2xl font-bold text-purple-600">
            {certificates.reduce((acc, c) => acc + c.skills.length, 0)}
          </p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Years</option>
            {getYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onView={handleViewCertificate}
            onDownload={handleDownloadCertificate}
            onShare={handleShareCertificate}
          />
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <Card className="p-12 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Certificates Found</h3>
          <p className="text-gray-500">
            Complete courses to earn certificates and showcase your achievements.
          </p>
        </Card>
      )}

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedCertificate.title}</h2>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {/* Certificate Preview */}
              <div className="border-2 border-gray-200 rounded-lg p-8 mb-6 bg-gradient-to-r from-primary-50 to-white">
                <div className="text-center mb-8">
                  <Award className="w-20 h-20 text-primary-600 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Certificate of Completion
                  </h1>
                  <p className="text-gray-600">This certifies that</p>
                  <p className="text-2xl font-bold text-primary-600 my-3">John Doe</p>
                  <p className="text-gray-600">has successfully completed the course</p>
                  <p className="text-xl font-bold text-gray-900 my-3">
                    {selectedCertificate.courseName}
                  </p>
                  <p className="text-gray-600 mb-4">
                    with a grade of {selectedCertificate.grade}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <p className="text-gray-500">Issue Date</p>
                    <p className="font-medium">
                      {new Date(selectedCertificate.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Credential ID</p>
                    <p className="font-medium">{selectedCertificate.credentialId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Issued By</p>
                    <p className="font-medium">{selectedCertificate.issuer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Instructor</p>
                    <p className="font-medium">{selectedCertificate.metadata?.instructor}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500 text-center">
                    This certificate can be verified at verify.zedu.co.zw/{selectedCertificate.credentialId}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Skills Acquired</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCertificate.skills.map((skill, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleDownloadCertificate(selectedCertificate)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleShareCertificate(selectedCertificate)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
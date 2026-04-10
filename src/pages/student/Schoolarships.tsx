import React, { useState, useEffect } from 'react';
import {
  Award, DollarSign, Calendar, Users,
  Search, CheckCircle, Globe, GraduationCap,
  Heart, Share2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
// TODO: Import toast for notifications when API is integrated
// import { toast } from 'react-hot-toast';
// TODO: Import scholarship API when backend is ready
// import { scholarshipAPI } from '../../api/scholarship.api';

interface Scholarship {
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
  applied?: boolean;
}

// 🔴 MOCK DATA STARTS HERE - Lines 45-250
// This is temporary mock data for development
// REPLACE WITH REAL API CALLS IN PRODUCTION
const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: '1',
    name: 'ZEDU Excellence Scholarship',
    provider: 'ZEDU Foundation',
    amount: 10000,
    amountType: 'fixed',
    description: 'Annual scholarship for outstanding students pursuing STEM degrees.',
    eligibility: [
      'Must be a Zimbabwean citizen',
      'Minimum 80% average in last exam',
      'Demonstrated leadership skills',
      'Accepted into a recognized university'
    ],
    requirements: [
      'Academic transcripts',
      'Two recommendation letters',
      'Personal statement',
      'Proof of admission'
    ],
    deadline: new Date('2024-08-31'),
    field: ['STEM', 'Computer Science', 'Engineering'],
    level: ['Undergraduate'],
    nationality: ['Zimbabwean'],
    numberOfAwards: 5,
    isNeedBased: false,
    isMeritBased: true,
    renewable: true,
    renewableDetails: 'Renewable annually based on maintaining 75% average',
    documents: ['Transcripts', 'Recommendation Letters', 'Personal Statement'],
    contactEmail: 'scholarships@zedu.co.zw',
    website: 'https://zedu.co.zw/scholarships',
    applicationUrl: 'https://apply.zedu.co.zw',
    status: 'open',
    popularity: 234
  },
  {
    id: '2',
    name: 'Women in Technology Scholarship',
    provider: 'Econet Zimbabwe',
    amount: 5000,
    amountType: 'fixed',
    description: 'Supporting female students pursuing careers in technology.',
    eligibility: [
      'Female Zimbabwean citizen',
      'Pursuing degree in Technology field',
      'Demonstrated interest in tech',
      'Good academic standing'
    ],
    requirements: [
      'Academic records',
      'Essay on career goals',
      'Letter of recommendation',
      'Portfolio (optional)'
    ],
    deadline: new Date('2024-09-15'),
    field: ['Computer Science', 'Information Technology', 'Software Engineering'],
    level: ['Undergraduate'],
    nationality: ['Zimbabwean'],
    gender: 'female',
    numberOfAwards: 3,
    isNeedBased: true,
    isMeritBased: true,
    renewable: false,
    documents: ['Academic Records', 'Essay', 'Recommendation Letter'],
    contactEmail: 'foundation@econet.co.zw',
    website: 'https://econet.co.zw/scholarships',
    applicationUrl: 'https://apply.econet.co.zw',
    status: 'open',
    popularity: 156
  },
  {
    id: '3',
    name: 'Cambridge International Scholarship',
    provider: 'Cambridge University',
    amount: 50000,
    amountType: 'partial',
    description: 'Full tuition scholarship for exceptional students to study at Cambridge.',
    eligibility: [
      'Outstanding academic record',
      'International student',
      'Strong English proficiency',
      'Demonstrated leadership'
    ],
    requirements: [
      'Academic transcripts',
      'Personal statement',
      'Research proposal',
      'Three recommendation letters'
    ],
    deadline: new Date('2024-10-31'),
    field: ['All Fields'],
    level: ['Postgraduate'],
    nationality: ['All'],
    numberOfAwards: 10,
    isNeedBased: false,
    isMeritBased: true,
    renewable: true,
    documents: ['Transcripts', 'Research Proposal', 'Recommendation Letters'],
    contactEmail: 'scholarships@cam.ac.uk',
    website: 'https://cam.ac.uk/scholarships',
    applicationUrl: 'https://apply.cam.ac.uk',
    status: 'open',
    popularity: 567
  },
  {
    id: '4',
    name: 'Zimbabwe Government Merit Scholarship',
    provider: 'Ministry of Education',
    amount: 20000,
    amountType: 'full',
    description: 'Government scholarship for top-performing A-Level students.',
    eligibility: [
      'Zimbabwean citizen',
      'Outstanding A-Level results',
      'Admitted to local university',
      'Demonstrated financial need'
    ],
    requirements: [
      'A-Level certificates',
      'Birth certificate',
      'Admission letter',
      'Financial statements'
    ],
    deadline: new Date('2024-07-31'),
    field: ['All Fields'],
    level: ['Undergraduate'],
    nationality: ['Zimbabwean'],
    numberOfAwards: 50,
    isNeedBased: true,
    isMeritBased: true,
    renewable: true,
    documents: ['Certificates', 'Admission Letter', 'Financial Statements'],
    contactEmail: 'scholarships@moe.gov.zw',
    website: 'https://moe.gov.zw/scholarships',
    applicationUrl: 'https://apply.moe.gov.zw',
    status: 'closing-soon',
    popularity: 890
  }
];
// 🔴 MOCK DATA ENDS HERE

export const Scholarships: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [appliedScholarships, setAppliedScholarships] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    loadScholarships();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [searchTerm, selectedField, selectedLevel, scholarships]);

  /**
   * 🟢 API INTEGRATION POINT 1 - Load Scholarships
   * ==============================================
   * Fetch all available scholarships from the backend
   * 
   * TODO: When backend is ready, uncomment the API call and remove mock data
   */
  const loadScholarships = async () => {
    try {
      setLoading(true);
      
      // 🔴 MOCK DATA - Remove this when integrating API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScholarships(MOCK_SCHOLARSHIPS);
      setFilteredScholarships(MOCK_SCHOLARSHIPS);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await scholarshipAPI.getAllScholarships();
      // setScholarships(response.data);
      // setFilteredScholarships(response.data);
      
    } catch (error) {
      console.error('Failed to load scholarships:', error);
      // TODO: Show error toast notification
      // toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 2 - Save Scholarship
   * =============================================
   * Save a scholarship to user's saved list
   * 
   * TODO: When backend is ready, uncomment the API call
   */
  const toggleSaveScholarship = async (scholarshipId: string) => {
    try {
      if (savedScholarships.includes(scholarshipId)) {
        // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
        setSavedScholarships(savedScholarships.filter(id => id !== scholarshipId));
        
        // 🟢 REAL API CALL - Uncomment when backend is ready
        // await scholarshipAPI.unsaveScholarship(scholarshipId);
        // toast.success('Scholarship removed from saved list');
      } else {
        // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
        setSavedScholarships([...savedScholarships, scholarshipId]);
        
        // 🟢 REAL API CALL - Uncomment when backend is ready
        // await scholarshipAPI.saveScholarship(scholarshipId);
        // toast.success('Scholarship saved to your list');
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      // toast.error('Failed to save scholarship');
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 3 - Apply for Scholarship
   * ==================================================
   * Submit application for a scholarship
   * 
   * TODO: When backend is ready, uncomment the API call
   */
  const applyForScholarship = async (scholarshipId: string) => {
    try {
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      setAppliedScholarships([...appliedScholarships, scholarshipId]);
      console.log('Applying for scholarship:', scholarshipId);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const scholarship = scholarships.find(s => s.id === scholarshipId);
      // if (scholarship) {
      //   // Redirect to application page or open modal
      //   window.open(scholarship.applicationUrl, '_blank');
      // }
      // await scholarshipAPI.trackApplication(scholarshipId);
      // toast.success('Application started!');
      
    } catch (error) {
      console.error('Failed to apply:', error);
      // toast.error('Failed to start application');
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 4 - Filter Scholarships by Field
   * =========================================================
   * Fetch scholarships filtered by field of study
   * 
   * TODO: When backend is ready, use API filtering instead of client-side
   */
  const filterScholarships = () => {
    let filtered = [...scholarships];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply field filter
    if (selectedField !== 'all') {
      filtered = filtered.filter(s =>
        s.field.some(f => f.toLowerCase() === selectedField.toLowerCase())
      );
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(s =>
        s.level.some(l => l.toLowerCase() === selectedLevel.toLowerCase())
      );
    }

    setFilteredScholarships(filtered);
  };

  /**
   * 🟢 API INTEGRATION POINT 5 - Get Scholarship Stats
   * ==================================================
   * Calculate statistics from scholarship data
   */
  const getScholarshipStats = () => {
    const availableCount = scholarships.filter(s => s.status !== 'closed').length;
    const closingSoonCount = scholarships.filter(s => isClosingSoon(s.deadline)).length;
    
    return { availableCount, closingSoonCount };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closing-soon': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (scholarship: Scholarship) => {
    if (scholarship.amountType === 'full') return 'Full Tuition';
    if (scholarship.amountType === 'partial') {
      return `Up to $${scholarship.amount.toLocaleString()}`;
    }
    return `$${scholarship.amount.toLocaleString()}`;
  };

  const isClosingSoon = (deadline: Date) => {
    const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft > 0;
  };

  const stats = getScholarshipStats();

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
        <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
        <p className="text-gray-600 mt-1">
          Find and apply for scholarships to fund your education
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-2xl font-bold text-green-600">{stats.availableCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Closing Soon</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.closingSoonCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Saved</p>
          <p className="text-2xl font-bold text-blue-600">{savedScholarships.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Applied</p>
          <p className="text-2xl font-bold text-purple-600">{appliedScholarships.length}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <Input
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          {/* 🟢 API INTEGRATION POINT 6 - Field Filter Dropdown */}
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Fields</option>
            <option value="stem">STEM</option>
            <option value="computer science">Computer Science</option>
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
            <option value="arts">Arts</option>
          </select>
          {/* 🟢 API INTEGRATION POINT 7 - Level Filter Dropdown */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Levels</option>
            <option value="ecd">ECD</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="diploma">Diploma</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
        </div>
      </Card>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScholarships.map((scholarship) => (
          <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {scholarship.providerLogo ? (
                    <img src={scholarship.providerLogo} alt={scholarship.provider} className="w-12 h-12 rounded mr-4" />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{scholarship.name}</h3>
                    <p className="text-sm text-gray-600">{scholarship.provider}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(
                  isClosingSoon(scholarship.deadline) ? 'closing-soon' : scholarship.status
                )}>
                  {isClosingSoon(scholarship.deadline) ? 'Closing Soon' : scholarship.status}
                </Badge>
              </div>

              {/* Amount */}
              <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-xl font-bold text-primary-600">
                      {formatAmount(scholarship)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {scholarship.numberOfAwards} awards
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {scholarship.popularity} applicants
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {scholarship.level.join(', ')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  {scholarship.nationality[0] === 'All' ? 'International' : 'Zimbabwean'}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {scholarship.description}
              </p>

              {/* Field Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {scholarship.field.slice(0, 3).map((field, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {field}
                  </Badge>
                ))}
              </div>

              {/* Eligibility Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Eligibility</h4>
                <ul className="space-y-1">
                  {scholarship.eligibility.slice(0, 2).map((item, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5" />
                      {item}
                    </li>
                  ))}
                  {scholarship.eligibility.length > 2 && (
                    <li className="text-xs text-gray-500">
                      +{scholarship.eligibility.length - 2} more requirements
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSaveScholarship(scholarship.id)}
                    className={`p-2 rounded-full hover:bg-gray-100 ${
                      savedScholarships.includes(scholarship.id) ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${savedScholarships.includes(scholarship.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                {appliedScholarships.includes(scholarship.id) ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Applied
                  </Badge>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => applyForScholarship(scholarship.id)}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <Card className="p-12 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Scholarships Found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find scholarships.
          </p>
        </Card>
      )}
    </div>
  );
};
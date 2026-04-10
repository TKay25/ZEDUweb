import React, { useState, useEffect } from 'react';
import {
  Briefcase, MapPin, Clock, DollarSign,
  Building, Search,
  Filter, Bookmark, Share2,
  CheckCircle, Calendar
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  experience: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: Date;
  deadline: Date;
  applicants: number;
  skills: string[];
  saved?: boolean;
  applied?: boolean;
}

interface CareerPath {
  id: string;
  title: string;
  industry: string;
  demandLevel: 'high' | 'medium' | 'low';
  salary: {
    entry: number;
    mid: number;
    senior: number;
  };
  education: string[];
  certifications: string[];
  skills: string[];
  outlook: string;
}

export const Career: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadCareerData();
  }, []);

  const loadCareerData = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setJobs([
        {
          id: '1',
          title: 'Software Engineer Intern',
          company: 'Econet Zimbabwe',
          location: 'Harare',
          type: 'internship',
          experience: '0-1 year',
          salary: { min: 500, max: 800, currency: 'USD' },
          description: 'Join our development team to build innovative mobile and web applications.',
          requirements: [
            'Currently pursuing degree in Computer Science or related field',
            'Knowledge of JavaScript and React',
            'Good problem-solving skills'
          ],
          responsibilities: [
            'Assist in developing web applications',
            'Write clean and maintainable code',
            'Participate in team meetings and code reviews'
          ],
          benefits: [
            'Hands-on experience',
            'Mentorship from senior developers',
            'Flexible working hours'
          ],
          postedDate: new Date('2024-03-01'),
          deadline: new Date('2024-04-15'),
          applicants: 45,
          skills: ['JavaScript', 'React', 'Node.js', 'Git']
        },
        {
          id: '2',
          title: 'Junior Data Scientist',
          company: 'Cassava Technologies',
          location: 'Harare',
          type: 'full-time',
          experience: '1-2 years',
          salary: { min: 1500, max: 2500, currency: 'USD' },
          description: 'Looking for a passionate data scientist to join our AI team.',
          requirements: [
            'Degree in Data Science, Statistics, or related field',
            'Experience with Python and machine learning libraries',
            'Strong analytical skills'
          ],
          responsibilities: [
            'Build and deploy machine learning models',
            'Analyze complex datasets',
            'Present insights to stakeholders'
          ],
          benefits: [
            'Competitive salary',
            'Health insurance',
            'Professional development budget'
          ],
          postedDate: new Date('2024-03-05'),
          deadline: new Date('2024-04-30'),
          applicants: 28,
          skills: ['Python', 'Machine Learning', 'SQL', 'Statistics']
        },
        {
          id: '3',
          title: 'Frontend Developer',
          company: 'ZEDU Platform',
          location: 'Remote',
          type: 'full-time',
          experience: '2-4 years',
          salary: { min: 2000, max: 3500, currency: 'USD' },
          description: 'Help build the future of education in Zimbabwe.',
          requirements: [
            'Strong experience with React and TypeScript',
            'Understanding of UI/UX principles',
            'Experience with state management'
          ],
          responsibilities: [
            'Develop new features for the ZEDU platform',
            'Optimize application performance',
            'Collaborate with backend team'
          ],
          benefits: [
            'Remote work',
            'Equity options',
            'Learning stipend'
          ],
          postedDate: new Date('2024-03-10'),
          deadline: new Date('2024-05-01'),
          applicants: 56,
          skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
        }
      ]);

      setCareerPaths([
        {
          id: '1',
          title: 'Software Engineer',
          industry: 'Technology',
          demandLevel: 'high',
          salary: { entry: 15000, mid: 35000, senior: 60000 },
          education: ["Bachelor's in Computer Science", "Coding Bootcamp"],
          certifications: ['AWS Certified Developer', 'Google Professional Developer'],
          skills: ['Programming', 'System Design', 'Problem Solving', 'Team Collaboration'],
          outlook: 'Expected to grow 22% in the next 5 years'
        },
        {
          id: '2',
          title: 'Data Scientist',
          industry: 'Technology',
          demandLevel: 'high',
          salary: { entry: 18000, mid: 45000, senior: 75000 },
          education: ["Master's in Data Science", "PhD in Statistics"],
          certifications: ['TensorFlow Developer', 'AWS Machine Learning'],
          skills: ['Machine Learning', 'Python', 'Statistics', 'Data Visualization'],
          outlook: 'One of the fastest-growing careers with 31% growth projected'
        }
      ]);
    } catch (error) {
      console.error('Failed to load career data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const applyForJob = (jobId: string) => {
    setAppliedJobs([...appliedJobs, jobId]);
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
        <h1 className="text-2xl font-bold text-gray-900">Career Center</h1>
        <p className="text-gray-600 mt-1">
          Explore job opportunities and career paths
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Jobs</p>
              <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Saved Jobs</p>
              <p className="text-2xl font-bold text-green-600">{savedJobs.length}</p>
            </div>
            <Bookmark className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Applications</p>
              <p className="text-2xl font-bold text-purple-600">{appliedJobs.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Custom Tab Component using native buttons */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'jobs', label: 'Job Listings' },
            { id: 'career-paths', label: 'Career Paths' },
            { id: 'applications', label: 'My Applications' },
            { id: 'saved', label: 'Saved Jobs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
              <Button variant="ghost">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Job Listings */}
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 rounded flex items-center justify-center">
                        <Building className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-2 rounded-full hover:bg-gray-100 ${
                              savedJobs.includes(job.id) ? 'text-primary-600' : 'text-gray-400'
                            }`}
                          >
                            <Bookmark className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.type.replace('-', ' ')}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.experience} experience
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                          <span className="mx-2">•</span>
                          {job.applicants} applicants
                        </div>
                        <div className="flex items-center space-x-3">
                          {appliedJobs.includes(job.id) ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Applied
                            </Badge>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => applyForJob(job.id)}
                            >
                              Apply Now
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Career Paths Tab */}
      {activeTab === 'career-paths' && (
        <div className="space-y-4">
          {careerPaths.map((path) => (
            <Card key={path.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{path.title}</h3>
                  <p className="text-gray-600 mb-2">{path.industry}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className={
                      path.demandLevel === 'high' ? 'bg-green-100 text-green-800' :
                      path.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {path.demandLevel} demand
                    </Badge>
                    <span className="text-sm text-gray-600">{path.outlook}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Entry Level</p>
                      <p className="text-lg font-bold text-green-600">
                        ${path.salary.entry.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Mid Level</p>
                      <p className="text-lg font-bold text-blue-600">
                        ${path.salary.mid.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">Senior Level</p>
                      <p className="text-lg font-bold text-purple-600">
                        ${path.salary.senior.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Education</h4>
                      <ul className="space-y-1">
                        {path.education.map((edu, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {path.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {appliedJobs.length > 0 ? (
            jobs.filter(job => appliedJobs.includes(job.id)).map((job) => (
              <Card key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>Applied on {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
              <p className="text-gray-500">
                Start applying to jobs to track your applications here.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Saved Jobs Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedJobs.length > 0 ? (
            jobs.filter(job => savedJobs.includes(job.id)).map((job) => (
              <Card key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => applyForJob(job.id)}>
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Saved Jobs</h3>
              <p className="text-gray-500">
                Save jobs you're interested in to review them later.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
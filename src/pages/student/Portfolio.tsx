import React, { useState, useEffect } from 'react';
import {
  Award, Briefcase, GraduationCap,
  Calendar, MapPin, Mail, Phone, Globe,
  Github, Linkedin, Edit,
  Download, Share2, Plus
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
// TODO: Import toast for notifications when API is integrated
// import { toast } from 'react-hot-toast';
// TODO: Import portfolio API when backend is ready
// import { portfolioAPI } from '../../api/portfolio.api';

// Define interfaces
interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  link?: string;
  date: Date;
}

interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: Date;
  description: string;
  type: 'certificate' | 'award' | 'publication';
}

interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
}

interface Education {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
}

interface Language {
  name: string;
  proficiency: string;
}

interface Student {
  id?: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  achievements: Achievement[];
  skills: string[];
  languages: Language[];
}

// Mock data for development - REPLACE WITH API CALLS IN PRODUCTION
const MOCK_STUDENT_DATA: Student = {
  name: 'Elton Shonhiwa',
  title: 'Computer Science Student',
  bio: 'Passionate about software development and artificial intelligence. Currently pursuing a degree in Computer Science with a focus on machine learning.',
  avatar: '/avatars/elton.jpg',
  email: 'elton.shonhiwa@student.zedu.co.zw',
  phone: '+263 77 123 4567',
  location: 'Harare, Zimbabwe',
  website: 'eltonshonhiwa.dev',
  github: 'engeltonsam',
  linkedin: 'elton shonhiwa',
  education: [
    {
      id: 'edu1',
      degree: 'BSc Mechatronics Engineering',
      institution: 'Chinhoyi University of Technology',
      location: 'Harare',
      startDate: new Date('2022-09-01'),
      endDate: new Date('2026-05-31'),
      current: true,
      description: 'Focusing on AI, Machine Learning, and Software Engineering'
    },
    {
      id: 'edu2',
      degree: 'A-Levels',
      institution: 'Prince Edward School',
      location: 'Harare',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2021-12-31'),
      current: false,
      description: 'Mathematics, Physics, Computer Science'
    }
  ],
  experience: [
    {
      id: 'exp1',
      title: 'Software Development Intern',
      organization: 'Econet Zimbabwe',
      location: 'Harare',
      startDate: new Date('2024-06-01'),
      current: true,
      description: 'Working on mobile app development using React Native and Node.js'
    },
    {
      id: 'exp2',
      title: 'Teaching Assistant',
      organization: 'University of Zimbabwe',
      location: 'Harare',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-05-31'),
      current: false,
      description: 'Assisted in teaching Introduction to Programming courses'
    }
  ],
  projects: [
    {
      id: 'proj1',
      title: 'ZEDU Learning Platform',
      description: 'Full-stack educational platform connecting students and teachers',
      technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      date: new Date('2024-02-01'),
      link: 'https://github.com/johndoe/zedu'
    },
    {
      id: 'proj2',
      title: 'AI Study Assistant',
      description: 'Chatbot that helps students with homework using NLP',
      technologies: ['Python', 'TensorFlow', 'Flask', 'React'],
      date: new Date('2023-11-01'),
      link: 'https://github.com/johndoe/ai-assistant'
    }
  ],
  achievements: [
    {
      id: 'ach1',
      title: 'Best Innovation Award',
      organization: 'Zimbabwe ICT Summit',
      date: new Date('2023-10-15'),
      description: 'Awarded for developing an AI-powered learning tool',
      type: 'award'
    },
    {
      id: 'ach2',
      title: 'Google IT Support Certificate',
      organization: 'Coursera',
      date: new Date('2023-08-20'),
      description: 'Professional certificate in IT support fundamentals',
      type: 'certificate'
    }
  ],
  skills: [
    'JavaScript/TypeScript',
    'React/React Native',
    'Node.js',
    'Python',
    'Machine Learning',
    'UI/UX Design',
    'Database Design',
    'Cloud Computing'
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Shona', proficiency: 'Native' },
    { name: 'Ndebele', proficiency: 'Conversational' }
  ]
};

export const Portfolio: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [student, setStudent] = useState<Student>(MOCK_STUDENT_DATA);
  const [isEditing, setIsEditing] = useState(false);

  // Load portfolio data on component mount
  useEffect(() => {
    loadPortfolioData();
  }, []);

  /**
   * 🟢 API INTEGRATION POINT 1 - Load Portfolio Data
   * ================================================
   * Replace the mock data with real API call
   * 
   * TODO: When backend is ready, uncomment the API call and remove mock data
   */
  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      
      // 🔴 MOCK DATA - Remove this when integrating API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudent(MOCK_STUDENT_DATA);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.getStudentPortfolio();
      // setStudent(response.data);
      
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      // TODO: Show error toast notification
      // toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 2 - Add Project
   * ========================================
   * Send new project data to backend
   */
  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      setLoading(true);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.addProject(projectData);
      // const newProject = response.data;
      // setStudent(prev => ({
      //   ...prev,
      //   projects: [...prev.projects, newProject]
      // }));
      // toast.success('Project added successfully!');
      
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString()
      };
      setStudent(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      
    } catch (error) {
      console.error('Failed to add project:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 3 - Add Experience
   * ===========================================
   * Send new experience data to backend
   */
  const addExperience = async (experienceData: Omit<Experience, 'id'>) => {
    try {
      setLoading(true);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.addExperience(experienceData);
      // const newExperience = response.data;
      // setStudent(prev => ({
      //   ...prev,
      //   experience: [...prev.experience, newExperience]
      // }));
      // toast.success('Experience added successfully!');
      
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      const newExperience: Experience = {
        ...experienceData,
        id: Date.now().toString()
      };
      setStudent(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
      
    } catch (error) {
      console.error('Failed to add experience:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 4 - Add Education
   * ==========================================
   * Send new education data to backend
   */
  const addEducation = async (educationData: Omit<Education, 'id'>) => {
    try {
      setLoading(true);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.addEducation(educationData);
      // const newEducation = response.data;
      // setStudent(prev => ({
      //   ...prev,
      //   education: [...prev.education, newEducation]
      // }));
      // toast.success('Education added successfully!');
      
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      const newEducation: Education = {
        ...educationData,
        id: Date.now().toString()
      };
      setStudent(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      
    } catch (error) {
      console.error('Failed to add education:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 5 - Add Achievement
   * ============================================
   * Send new achievement data to backend
   */
  const addAchievement = async (achievementData: Omit<Achievement, 'id'>) => {
    try {
      setLoading(true);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.addAchievement(achievementData);
      // const newAchievement = response.data;
      // setStudent(prev => ({
      //   ...prev,
      //   achievements: [...prev.achievements, newAchievement]
      // }));
      // toast.success('Achievement added successfully!');
      
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      const newAchievement: Achievement = {
        ...achievementData,
        id: Date.now().toString()
      };
      setStudent(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      }));
      
    } catch (error) {
      console.error('Failed to add achievement:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 6 - Update Profile
   * ===========================================
   * Send updated profile data to backend
   */
  const updateProfile = async (profileData: Partial<Student>) => {
    try {
      setLoading(true);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.updateProfile(profileData);
      // const updatedProfile = response.data;
      // setStudent(prev => ({
      //   ...prev,
      //   ...updatedProfile
      // }));
      // toast.success('Profile updated successfully!');
      
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      setStudent(prev => ({
        ...prev,
        ...profileData
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 7 - Download CV
   * ========================================
   * Download portfolio as PDF
   */
  const handleDownloadCV = async () => {
    try {
      setLoading(true);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.downloadCV();
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `${student.name.replace(/\s/g, '_')}_Portfolio.pdf`;
      // link.click();
      // window.URL.revokeObjectURL(url);
      // toast.success('CV downloaded successfully!');
      
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      console.log('Downloading CV for:', student.name);
      alert('CV download will be available when backend is integrated');
      
    } catch (error) {
      console.error('Failed to download CV:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟢 API INTEGRATION POINT 8 - Share Portfolio
   * ============================================
   * Generate shareable link for portfolio
   */
  const handleSharePortfolio = async () => {
    try {
      setLoading(true);
      
      // 🟢 REAL API CALL - Uncomment when backend is ready
      // const response = await portfolioAPI.getShareableLink();
      // const shareableLink = response.data.link;
      // await navigator.clipboard.writeText(shareableLink);
      // toast.success('Portfolio link copied to clipboard!');
      
      // 🔴 MOCK IMPLEMENTATION - Remove when integrating API
      const mockLink = `https://zedu.co.zw/portfolio/${student.id || 'student'}`;
      await navigator.clipboard.writeText(mockLink);
      alert('Portfolio link copied to clipboard!');
      
    } catch (error) {
      console.error('Failed to share portfolio:', error);
    } finally {
      setLoading(false);
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
      {/* Header Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleDownloadCV}>
          <Download className="w-4 h-4 mr-2" />
          Download CV
        </Button>
        <Button variant="outline" onClick={handleSharePortfolio}>
          <Share2 className="w-4 h-4 mr-2" />
          Share Portfolio
        </Button>
        <Button variant="primary" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <Avatar src={student.avatar} name={student.name} size="xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{student.title}</p>
            <p className="text-gray-700 max-w-2xl">{student.bio}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {student.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {student.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {student.location}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  {student.website}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Github className="w-4 h-4 mr-2" />
                  {student.github}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Linkedin className="w-4 h-4 mr-2" />
                  {student.linkedin}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'projects', label: 'Projects' },
            { id: 'experience', label: 'Experience' },
            { id: 'education', label: 'Education' },
            { id: 'achievements', label: 'Achievements' }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Skills */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, index) => (
                <Badge key={index} className="bg-primary-100 text-primary-800 text-sm py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Languages */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Languages</h2>
            <div className="space-y-3">
              {student.languages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-sm text-gray-600">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Projects */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('projects')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {student.projects.slice(0, 2).map((project) => (
                <div key={project.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <h3 className="font-medium mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="secondary" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => {
              // TODO: Open modal to add new project
              const newProject = {
                title: 'New Project',
                description: 'Project description',
                technologies: ['React', 'TypeScript'],
                date: new Date()
              };
              addProject(newProject);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
          {student.projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => {
              // TODO: Open modal to add new experience
              const newExp = {
                title: 'New Position',
                organization: 'Company Name',
                location: 'Harare',
                startDate: new Date(),
                current: true,
                description: 'Job description'
              };
              addExperience(newExp);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
          {student.experience.map((exp) => (
            <Card key={exp.id} className="p-6">
              <div className="flex items-start space-x-4">
                <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="text-gray-600">{exp.organization}</p>
                    </div>
                    {exp.current && (
                      <Badge className="bg-green-100 text-green-800">Current</Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {exp.location}
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => {
              // TODO: Open modal to add new education
              const newEdu = {
                degree: 'New Degree',
                institution: 'University Name',
                location: 'Harare',
                startDate: new Date(),
                current: true,
                description: 'Course description'
              };
              addEducation(newEdu);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
          {student.education.map((edu, index) => (
            <Card key={edu.id || index} className="p-6">
              <div className="flex items-start space-x-4">
                <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    {edu.current && (
                      <Badge className="bg-green-100 text-green-800">In Progress</Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {edu.location}
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {edu.current ? 'Present' : new Date(edu.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <p className="text-gray-700">{edu.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => {
              // TODO: Open modal to add new achievement
              const newAch = {
                title: 'New Achievement',
                organization: 'Organization Name',
                date: new Date(),
                description: 'Achievement description',
                type: 'award' as const
              };
              addAchievement(newAch);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
          </div>
          {student.achievements.map((achievement) => (
            <Card key={achievement.id} className="p-6">
              <div className="flex items-start space-x-4">
                <Award className="w-5 h-5 text-yellow-500 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{achievement.title}</h3>
                  <p className="text-gray-600 mb-2">{achievement.organization}</p>
                  <p className="text-gray-700 mb-2">{achievement.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
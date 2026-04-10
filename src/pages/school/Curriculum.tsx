// src/pages/school/Curriculum.tsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Edit2,
  Eye, Download, CheckCircle,
  Award, GraduationCap, ChevronDown, ChevronRight,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
//import schoolAPI from '../../api/school.api';
import { toast } from 'react-hot-toast';

interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  level: 'junior' | 'senior' | 'all';
  credits: number;
  hoursPerWeek: number;
  description?: string;
  objectives?: string[];
  topics: Topic[];
  prerequisites?: string[];
  assessment: {
    continuous: number;
    exam: number;
    practical?: number;
  };
  resources: Array<{
    id: string;
    name: string;
    type: 'textbook' | 'reference' | 'online' | 'other';
    author?: string;
    isbn?: string;
  }>;
}

interface Topic {
  id: string;
  name: string;
  week: number;
  description: string;
  subtopics: string[];
  learningObjectives: string[];
  resources?: string[];
}

interface GradeLevel {
  id: string;
  name: string;
  subjects: Subject[];
  core: string[];
  electives: string[];
  minElectives: number;
}

interface CurriculumData {
  id: string;
  name: string;
  academicYear: string;
  grades: GradeLevel[];
  version: string;
  approvedBy?: string;
  approvedDate?: Date;
  status: 'draft' | 'review' | 'approved' | 'archived';
}

export const Curriculum: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [curriculum, setCurriculum] = useState<CurriculumData | null>(null);
  const [curriculums, setCurriculums] = useState<CurriculumData[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);

  useEffect(() => {
    loadCurriculums();
  }, []);

  const loadCurriculums = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCurriculum: CurriculumData = {
        id: '1',
        name: 'Cambridge International Curriculum',
        academicYear: '2024',
        version: '1.0',
        status: 'draft',
        grades: [
          {
            id: 'form1',
            name: 'Form 1',
            subjects: [
              {
                id: 'sub1',
                code: 'MATH101',
                name: 'Mathematics',
                department: 'Mathematics',
                level: 'junior',
                credits: 5,
                hoursPerWeek: 4,
                description: 'Basic algebra and geometry',
                topics: [
                  {
                    id: 'topic1',
                    name: 'Algebra Fundamentals',
                    week: 1,
                    description: 'Introduction to algebraic expressions',
                    subtopics: ['Variables', 'Expressions', 'Equations'],
                    learningObjectives: ['Understand variables', 'Solve simple equations']
                  },
                  {
                    id: 'topic2',
                    name: 'Geometry Basics',
                    week: 2,
                    description: 'Shapes and angles',
                    subtopics: ['Points', 'Lines', 'Angles'],
                    learningObjectives: ['Identify shapes', 'Measure angles']
                  }
                ],
                assessment: {
                  continuous: 40,
                  exam: 60
                },
                resources: []
              },
              {
                id: 'sub2',
                code: 'ENG101',
                name: 'English',
                department: 'Languages',
                level: 'junior',
                credits: 5,
                hoursPerWeek: 4,
                description: 'English language and literature',
                topics: [
                  {
                    id: 'topic3',
                    name: 'Grammar',
                    week: 1,
                    description: 'Parts of speech',
                    subtopics: ['Nouns', 'Verbs', 'Adjectives'],
                    learningObjectives: ['Identify parts of speech', 'Use correct grammar']
                  }
                ],
                assessment: {
                  continuous: 50,
                  exam: 50
                },
                resources: []
              }
            ],
            core: ['MATH101', 'ENG101'],
            electives: [],
            minElectives: 2
          }
        ]
      };
      
      setCurriculums([mockCurriculum]);
      setCurriculum(mockCurriculum);
      if (mockCurriculum.grades.length > 0) {
        setSelectedGrade(mockCurriculum.grades[0].id);
      }
    } catch (error) {
      toast.error('Failed to load curriculums');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCurriculum = async () => {
    if (!curriculum) return;
    
    try {
      // In a real app, you would call: await schoolAPI.updateCurriculum(updatedCurriculum);
      const updatedCurriculum = {
        ...curriculum,
        status: 'approved' as const,
        approvedDate: new Date(),
        approvedBy: 'Current User'
      };
      setCurriculum(updatedCurriculum);
      toast.success('Curriculum approved successfully');
    } catch (error) {
      toast.error('Failed to approve curriculum');
      console.error(error);
    }
  };

  const getCurrentGrade = () => {
    return curriculum?.grades.find(g => g.id === selectedGrade);
  };

  const filteredSubjects = () => {
    const grade = getCurrentGrade();
    if (!grade) return [];
    
    return grade.subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading || !curriculum) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const currentGrade = getCurrentGrade();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Curriculum Management</h1>
        <div className="flex items-center space-x-3">
          <Badge className={
            curriculum.status === 'approved' ? 'bg-green-100 text-green-800' :
            curriculum.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
            curriculum.status === 'draft' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }>
            {curriculum.status}
          </Badge>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {curriculum.status === 'draft' && (
            <Button onClick={handleApproveCurriculum}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Curriculum
            </Button>
          )}
        </div>
      </div>

      {/* Curriculum Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{curriculum.name}</h2>
            <p className="text-gray-600">Academic Year: {curriculum.academicYear} • Version {curriculum.version}</p>
          </div>
          <select
            value={curriculum.id}
            onChange={(e) => {
              const selected = curriculums.find(c => c.id === e.target.value);
              setCurriculum(selected || null);
              if (selected && selected.grades.length > 0) {
                setSelectedGrade(selected.grades[0].id);
              }
            }}
            className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {curriculums.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.academicYear})</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Grade Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {curriculum.grades.map(grade => (
          <button
            key={grade.id}
            onClick={() => setSelectedGrade(grade.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedGrade === grade.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {grade.name}
          </button>
        ))}
      </div>

      {currentGrade && (
        <>
          {/* Grade Overview */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{currentGrade.name} Curriculum</h3>
                <p className="text-gray-600">
                  {currentGrade.subjects.length} Subjects • {currentGrade.core.length} Core • {currentGrade.electives.length} Electives
                </p>
              </div>
              <Button onClick={() => setShowAddSubject(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentGrade.subjects.length}</p>
                <p className="text-sm text-gray-500">Total Subjects</p>
              </Card>
              <Card className="p-4 text-center">
                <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {currentGrade.subjects.reduce((acc, s) => acc + s.credits, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Credits</p>
              </Card>
              <Card className="p-4 text-center">
                <GraduationCap className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentGrade.minElectives}</p>
                <p className="text-sm text-gray-500">Min. Electives</p>
              </Card>
            </div>
          </Card>

          {/* Search */}
          <Card className="p-4">
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </Card>

          {/* Subjects List */}
          <div className="space-y-4">
            {filteredSubjects().map(subject => (
              <Card key={subject.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{subject.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800">{subject.code}</Badge>
                      <Badge className="bg-green-100 text-green-800">{subject.department}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <span className="text-gray-500">Credits: {subject.credits}</span>
                      <span className="text-gray-500">Hours/Week: {subject.hoursPerWeek}</span>
                      <span className="text-gray-500">Level: {subject.level}</span>
                    </div>

                    <div className="mt-3 flex space-x-3 text-sm">
                      <span className="text-gray-600">Assessment:</span>
                      <span>CA: {subject.assessment.continuous}%</span>
                      <span>Exam: {subject.assessment.exam}%</span>
                      {subject.assessment.practical && (
                        <span>Practical: {subject.assessment.practical}%</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedSubject(subject)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Topics Section */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Topics ({subject.topics.length})</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setShowAddTopic(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Topic
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {subject.topics.map(topic => (
                      <div key={topic.id} className="border rounded-lg">
                        <button
                          onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <span className="w-16 text-sm text-gray-500">Week {topic.week}</span>
                            <span className="font-medium">{topic.name}</span>
                          </div>
                          {expandedTopic === topic.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {expandedTopic === topic.id && (
                          <div className="px-4 pb-4 space-y-3">
                            <p className="text-sm text-gray-700">{topic.description}</p>
                            
                            <div>
                              <h5 className="text-sm font-medium mb-2">Learning Objectives</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {topic.learningObjectives.map((obj, i) => (
                                  <li key={i} className="text-sm text-gray-600">{obj}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium mb-2">Subtopics</h5>
                              <div className="flex flex-wrap gap-2">
                                {topic.subtopics.map((sub, i) => (
                                  <Badge key={i} className="bg-gray-100 text-gray-800">
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedSubject.name}</h2>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Subject Code</label>
                  <p className="font-medium">{selectedSubject.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <p className="font-medium">{selectedSubject.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Credits</label>
                  <p className="font-medium">{selectedSubject.credits}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Hours/Week</label>
                  <p className="font-medium">{selectedSubject.hoursPerWeek}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-700">{selectedSubject.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Assessment Breakdown</label>
                <div className="mt-2 space-y-1">
                  <p>Continuous Assessment: {selectedSubject.assessment.continuous}%</p>
                  <p>Final Exam: {selectedSubject.assessment.exam}%</p>
                  {selectedSubject.assessment.practical && (
                    <p>Practical: {selectedSubject.assessment.practical}%</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setSelectedSubject(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Subject</h2>
              <button
                onClick={() => setShowAddSubject(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Name</label>
                  <Input placeholder="e.g., Mathematics" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Code</label>
                  <Input placeholder="e.g., MATH101" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Subject description..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>Languages</option>
                    <option>Humanities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>junior</option>
                    <option>senior</option>
                    <option>all</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Credits</label>
                  <Input type="number" min={1} max={10} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">CA %</label>
                  <Input type="number" min={0} max={100} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Exam %</label>
                  <Input type="number" min={0} max={100} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Practical %</label>
                  <Input type="number" min={0} max={100} />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddSubject(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Add Subject
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopic && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Topic to {selectedSubject.name}</h2>
              <button
                onClick={() => setShowAddTopic(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Topic Name</label>
                  <Input placeholder="e.g., Algebra Fundamentals" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Week Number</label>
                  <Input type="number" min={1} max={40} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Topic description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Learning Objectives (one per line)</label>
                <textarea
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Understand variables&#10;Solve equations&#10;Apply formulas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subtopics (comma separated)</label>
                <Input placeholder="Variables, Expressions, Equations" />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddTopic(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Add Topic
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
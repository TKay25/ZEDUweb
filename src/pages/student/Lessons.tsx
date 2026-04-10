import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PlayCircle, CheckCircle, Lock,
  ChevronLeft, BookOpen, MessageCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import LessonPlayer from '../../components/student/LessonPlayer';
import { Avatar } from '../../components/ui/Avatar';

// Define interfaces matching LessonPlayer expectations
interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;  // Changed from string to number
  type: 'video' | 'document' | 'quiz' | 'assignment';
  completed: boolean;
  locked: boolean;
  order: number;
  videoUrl?: string;
  durationSeconds?: number;
  attachments?: Array<{ name: string; url: string; size: string }>;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  sections: Section[];
}

// Helper function to format duration from seconds to MM:SS
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const Lessons: React.FC = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(-1);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const getAllLessons = (courseData: Course): Lesson[] => {
    return courseData.sections.flatMap(section => section.lessons);
  };

  const findNextLesson = (currentId: string, lessons: Lesson[]): Lesson | null => {
    const currentIndex = lessons.findIndex(l => l.id === currentId);
    if (currentIndex !== -1 && currentIndex + 1 < lessons.length) {
      const nextLesson = lessons[currentIndex + 1];
      return !nextLesson.locked ? nextLesson : null;
    }
    return null;
  };

  const findPreviousLesson = (currentId: string, lessons: Lesson[]): Lesson | null => {
    const currentIndex = lessons.findIndex(l => l.id === currentId);
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      return !prevLesson.locked ? prevLesson : null;
    }
    return null;
  };

  const loadCourse = async () => {
    try {
      setLoading(true);
      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCourse: Course = {
        id: courseId || '1',
        title: 'Advanced Mathematics',
        progress: 65,
        totalLessons: 24,
        completedLessons: 16,
        sections: [
          {
            id: '1',
            title: 'Introduction to Calculus',
            lessons: [
              {
                id: '1',
                title: 'What is Calculus?',
                description: 'An introduction to the fundamental concepts of calculus and its applications in real-world scenarios.',
                duration: 930, // 15:30 in seconds
                type: 'video',
                completed: true,
                locked: false,
                order: 1,
                videoUrl: 'https://example.com/video1.mp4',
                durationSeconds: 930
              },
              {
                id: '2',
                title: 'History of Calculus',
                description: 'Explore the fascinating history of calculus development by Newton and Leibniz.',
                duration: 765, // 12:45 in seconds
                type: 'video',
                completed: true,
                locked: false,
                order: 2,
                videoUrl: 'https://example.com/video2.mp4',
                durationSeconds: 765
              },
              {
                id: '3',
                title: 'Limits Introduction',
                description: 'Learn the concept of limits and how they form the foundation of calculus.',
                duration: 1215, // 20:15 in seconds
                type: 'video',
                completed: false,
                locked: false,
                order: 3,
                videoUrl: 'https://example.com/video3.mp4',
                durationSeconds: 1215,
                attachments: [
                  { name: 'Lesson Notes.pdf', url: '#', size: '2.5 MB' },
                  { name: 'Practice Problems.pdf', url: '#', size: '1.8 MB' }
                ]
              },
              {
                id: '4',
                title: 'Limit Laws',
                description: 'Master the essential laws and properties of limits for solving complex problems.',
                duration: 1100, // 18:20 in seconds
                type: 'quiz',
                completed: false,
                locked: true,
                order: 4
              }
            ]
          },
          {
            id: '2',
            title: 'Derivatives',
            lessons: [
              {
                id: '5',
                title: 'Definition of Derivative',
                description: 'Understand the formal definition of derivative and its geometric interpretation.',
                duration: 1330, // 22:10 in seconds
                type: 'video',
                completed: true,
                locked: false,
                order: 5,
                videoUrl: 'https://example.com/video5.mp4',
                durationSeconds: 1330
              },
              {
                id: '6',
                title: 'Differentiation Rules',
                description: 'Learn the essential rules for differentiating various types of functions.',
                duration: 1530, // 25:30 in seconds
                type: 'video',
                completed: true,
                locked: false,
                order: 6,
                videoUrl: 'https://example.com/video6.mp4',
                durationSeconds: 1530
              },
              {
                id: '7',
                title: 'Chain Rule',
                description: 'Master the chain rule for differentiating composite functions.',
                duration: 1185, // 19:45 in seconds
                type: 'assignment',
                completed: false,
                locked: false,
                order: 7
              },
              {
                id: '8',
                title: 'Implicit Differentiation',
                description: 'Learn how to differentiate equations where y is not explicitly defined.',
                duration: 1275, // 21:15 in seconds
                type: 'video',
                completed: false,
                locked: true,
                order: 8,
                videoUrl: 'https://example.com/video8.mp4',
                durationSeconds: 1275
              }
            ]
          },
          {
            id: '3',
            title: 'Applications of Derivatives',
            lessons: [
              {
                id: '9',
                title: 'Related Rates',
                description: 'Solve real-world problems involving rates of change.',
                duration: 1420, // 23:40 in seconds
                type: 'video',
                completed: false,
                locked: true,
                order: 9,
                videoUrl: 'https://example.com/video9.mp4',
                durationSeconds: 1420
              },
              {
                id: '10',
                title: 'Optimization Problems',
                description: 'Learn techniques for finding maximum and minimum values in real-world scenarios.',
                duration: 1580, // 26:20 in seconds
                type: 'document',
                completed: false,
                locked: true,
                order: 10
              }
            ]
          }
        ]
      };
      
      setCourse(mockCourse);
      
      const allLessons = getAllLessons(mockCourse);
      const firstUnlockedLesson = allLessons.find(l => !l.locked && !l.completed);
      
      if (firstUnlockedLesson) {
        const index = allLessons.findIndex(l => l.id === firstUnlockedLesson.id);
        setCurrentLesson(firstUnlockedLesson);
        setCurrentLessonIndex(index);
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson: Lesson, index: number) => {
    if (!lesson.locked) {
      setCurrentLesson(lesson);
      setCurrentLessonIndex(index);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    console.log('Lesson completed:', lessonId);
    // Update lesson completion status in your state/backend
    // You can also auto-advance to next lesson here
  };

  const handleNextLesson = () => {
    if (course && currentLesson && currentLessonIndex !== -1) {
      const allLessons = getAllLessons(course);
      const nextLesson = findNextLesson(currentLesson.id, allLessons);
      if (nextLesson) {
        const nextIndex = allLessons.findIndex(l => l.id === nextLesson.id);
        setCurrentLesson(nextLesson);
        setCurrentLessonIndex(nextIndex);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (course && currentLesson && currentLessonIndex !== -1) {
      const allLessons = getAllLessons(course);
      const prevLesson = findPreviousLesson(currentLesson.id, allLessons);
      if (prevLesson) {
        const prevIndex = allLessons.findIndex(l => l.id === prevLesson.id);
        setCurrentLesson(prevLesson);
        setCurrentLessonIndex(prevIndex);
      }
    }
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const allLessons = getAllLessons(course);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Link
            to={`/student/courses/${courseId}`}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Course
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-1">
            {course.completedLessons} of {course.totalLessons} lessons completed
          </p>
        </div>
        <ProgressBar value={course.progress} className="w-64 h-2" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Lessons List */}
        <div className="col-span-1">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Course Content</h2>
            <div className="space-y-6">
              {course.sections.map((section: Section) => (
                <div key={section.id}>
                  <h3 className="font-medium text-sm text-gray-700 mb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.lessons.map((lesson: Lesson) => {
                      const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson, globalIndex)}
                          disabled={lesson.locked}
                          className={`w-full flex items-center p-2 rounded-lg text-left ${
                            currentLesson?.id === lesson.id
                              ? 'bg-primary-50 border border-primary-200'
                              : 'hover:bg-gray-50'
                          } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : lesson.locked ? (
                              <Lock className="w-5 h-5 text-gray-400" />
                            ) : (
                              <PlayCircle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDuration(lesson.duration)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Lesson Player */}
        <div className="col-span-2">
          {currentLesson ? (
            <LessonPlayer
              lesson={currentLesson}
              onComplete={handleLessonComplete}
              onNext={handleNextLesson}
              onPrevious={handlePreviousLesson}
            />
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Lesson</h3>
              <p className="text-gray-500">
                Choose a lesson from the list to start learning
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Discussion Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Discussion</h2>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar name="John Doe" size="sm" />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium mb-1">John Doe</p>
                <p className="text-sm text-gray-700">
                  Can someone explain the chain rule in more detail? I'm having trouble understanding the concept.
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <button className="hover:text-primary-600">Reply</button>
                <button className="hover:text-primary-600">Like</button>
                <span>2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 ml-8">
            <Avatar name="Dr. Sarah Johnson" size="sm" />
            <div className="flex-1">
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-sm font-medium mb-1 text-primary-600">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-700">
                  The chain rule is used when you have a function within another function. Think of it as taking the derivative from the outside in. I'll post an example in the resources section.
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <button className="hover:text-primary-600">Reply</button>
                <button className="hover:text-primary-600">Like</button>
                <span>1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
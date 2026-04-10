const fs = require('fs');
const path = require('fs');

// UI Components to create
const uiComponents = {
  'Tabs.tsx': `import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

export const Tabs = ({ children, defaultValue, className = '' }: TabsProps) => {
  return <div className={\`tabs \${className}\`} data-default={defaultValue}>{children}</div>;
};

export const TabsList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={\`tabs-list \${className}\`}>{children}</div>;
};

export const TabsTrigger = ({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) => {
  return <button className={\`tabs-trigger \${className}\`} data-value={value}>{children}</button>;
};

export const TabsContent = ({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) => {
  return <div className={\`tabs-content \${className}\`} data-value={value}>{children}</div>;
};`,

  'Badge.tsx': `import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  return <span className={\`badge badge-\${variant} \${className}\`}>{children}</span>;
};`,

  'Avatar.tsx': `import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar = ({ src, alt, fallback, size = 'md', className = '' }: AvatarProps) => {
  return (
    <div className={\`avatar avatar-\${size} \${className}\`}>
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <div className="avatar-fallback">{fallback || alt?.charAt(0) || 'U'}</div>
      )}
    </div>
  );
};`,

  'Card.tsx': `import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return <div className={\`card \${className}\`}>{children}</div>;
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return <div className={\`card-header \${className}\`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }: CardProps) => {
  return <h3 className={\`card-title \${className}\`}>{children}</h3>;
};

export const CardContent = ({ children, className = '' }: CardProps) => {
  return <div className={\`card-content \${className}\`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }: CardProps) => {
  return <div className={\`card-footer \${className}\`}>{children}</div>;
};`,

  'Button.tsx': `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={\`btn btn-\${variant} btn-\${size} \${className}\`} 
      {...props}
    >
      {children}
    </button>
  );
};`,

  'Input.tsx': `import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', id, ...props }: InputProps) => {
  const inputId = id || \`input-\${Math.random().toString(36).substr(2, 9)}\`;
  
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <input
        id={inputId}
        className={\`input \${error ? 'input-error' : ''} \${className}\`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};`,

  'Select.tsx': `import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export const Select = ({ label, options, error, className = '', id, ...props }: SelectProps) => {
  const selectId = id || \`select-\${Math.random().toString(36).substr(2, 9)}\`;
  
  return (
    <div className="select-wrapper">
      {label && <label htmlFor={selectId} className="select-label">{label}</label>}
      <select
        id={selectId}
        className={\`select \${error ? 'select-error' : ''} \${className}\`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error-message">{error}</span>}
    </div>
  );
};`,

  'ProgressBar.tsx': `import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showValue = false, 
  className = '' 
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={\`progress \${className}\`}>
      {(label || showValue) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showValue && <span className="progress-value">{value}/{max}</span>}
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: \`\${percentage}%\` }}
        />
      </div>
    </div>
  );
};`
};

// Student components
const studentComponents = {
  'CourseCard.tsx': `import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    image?: string;
    progress?: number;
    category?: string;
  };
  onEnroll?: (id: string) => void;
}

export const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  return (
    <Card className="course-card">
      {course.image && <img src={course.image} alt={course.title} className="course-image" />}
      <div className="course-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        {course.category && <Badge>{course.category}</Badge>}
        {course.progress !== undefined && (
          <div className="course-progress">
            Progress: {course.progress}%
          </div>
        )}
        {onEnroll && (
          <Button onClick={() => onEnroll(course.id)}>Enroll</Button>
        )}
      </div>
    </Card>
  );
};`,

  'LessonPlayer.tsx': `import React from 'react';

interface LessonPlayerProps {
  videoUrl?: string;
  title?: string;
  onComplete?: () => void;
}

export const LessonPlayer = ({ videoUrl, title, onComplete }: LessonPlayerProps) => {
  return (
    <div className="lesson-player">
      <h2>{title || 'Lesson'}</h2>
      {videoUrl ? (
        <video src={videoUrl} controls className="lesson-video" />
      ) : (
        <div className="lesson-placeholder">
          <p>Video content coming soon</p>
        </div>
      )}
      {onComplete && (
        <button onClick={onComplete} className="complete-button">
          Mark as Complete
        </button>
      )}
    </div>
  );
};`
};

// API files
const apiFiles = {
  'tutor.api.ts': `import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const tutorAPI = {
  getStudents: async () => {
    try {
      const response = await axios.get(\`\${BASE_URL}/tutor/students\`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  getCourses: async () => {
    try {
      const response = await axios.get(\`\${BASE_URL}/tutor/courses\`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getAssignments: async () => {
    try {
      const response = await axios.get(\`\${BASE_URL}/tutor/assignments\`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  getEarnings: async () => {
    try {
      const response = await axios.get(\`\${BASE_URL}/tutor/earnings\`);
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await axios.get(\`\${BASE_URL}/tutor/analytics\`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  createCourse: async (courseData: any) => {
    try {
      const response = await axios.post(\`\${BASE_URL}/tutor/courses\`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  updateCourse: async (id: string, courseData: any) => {
    try {
      const response = await axios.put(\`\${BASE_URL}/tutor/courses/\${id}\`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    try {
      const response = await axios.delete(\`\${BASE_URL}/tutor/courses/\${id}\`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  gradeSubmission: async (submissionId: string, grade: number, feedback: string) => {
    try {
      const response = await axios.post(\`\${BASE_URL}/tutor/submissions/\${submissionId}/grade\`, {
        grade,
        feedback
      });
      return response.data;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw error;
    }
  },

  markAttendance: async (classId: string, studentIds: string[], status: string) => {
    try {
      const response = await axios.post(\`\${BASE_URL}/tutor/attendance\`, {
        classId,
        studentIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }
};`
};

// Write UI components
Object.entries(uiComponents).forEach(([filename, content]) => {
  const filepath = path.join('src/components/ui', filename);
  fs.writeFileSync(filepath, content);
  console.log(`✅ Created: ${filepath}`);
});

// Write student components
Object.entries(studentComponents).forEach(([filename, content]) => {
  const filepath = path.join('src/components/student', filename);
  fs.writeFileSync(filepath, content);
  console.log(`✅ Created: ${filepath}`);
});

// Write API files
Object.entries(apiFiles).forEach(([filename, content]) => {
  const filepath = path.join('src/api', filename);
  fs.writeFileSync(filepath, content);
  console.log(`✅ Created: ${filepath}`);
});

console.log('\n🎉 All components created successfully!');
// src/components/auth/StudentRegistrationForm.tsx
import React, { useState } from 'react';
// Fix: Create StudentRegistrationData interface locally since it doesn't exist in auth.types
// Use type-only import for ValidationErrors
import type { ValidationErrors } from '../../types/auth.types';

// Define StudentRegistrationData interface locally
interface StudentRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'student';
  acceptTerms: boolean;
  grade: number;
  dateOfBirth: string;
  parentEmail: string;
  schoolName: string;
  subjects: string[];
  learningGoals: string;
}

interface StudentRegistrationFormProps {
  onSubmit: (data: StudentRegistrationData) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({
  onSubmit,
  onBack,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<StudentRegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student',
    acceptTerms: false,
    grade: 1,
    dateOfBirth: '',
    parentEmail: '',
    schoolName: '',
    subjects: [],
    learningGoals: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const grades = Array.from({ length: 12 }, (_, i) => i + 1);
  const subjectsList = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art',
    'Music', 'Physical Education', 'Foreign Language'
  ];

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        break;
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'firstName':
        if (!value) return 'First name is required';
        break;
      case 'lastName':
        if (!value) return 'Last name is required';
        break;
      case 'grade':
        if (!value) return 'Grade is required';
        break;
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 5 || age > 20) return 'Invalid age range';
        break;
      case 'parentEmail':
        if (value && !/\S+@\S+\.\S+/.test(value)) return 'Parent email is invalid';
        break;
      case 'acceptTerms':
        if (!value) return 'You must accept the terms and conditions';
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'subjects') {
        const subject = value;
        setFormData((prev: StudentRegistrationData) => ({
          ...prev,
          subjects: checked 
            ? [...prev.subjects, subject]
            : prev.subjects.filter((s: string) => s !== subject)
        }));
      } else {
        setFormData((prev: StudentRegistrationData) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev: StudentRegistrationData) => ({ ...prev, [name]: value }));
    }

    if (touched.has(name)) {
      const error = validateField(name, value);
      setErrors((prev: ValidationErrors) => error ? { ...prev, [name]: error } : { ...prev, [name]: '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev: Set<string>) => new Set(prev).add(name));
    
    const error = validateField(name, value);
    setErrors((prev: ValidationErrors) => error ? { ...prev, [name]: error } : { ...prev, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'subjects' && key !== 'learningGoals' && key !== 'schoolName') {
        const error = validateField(key, formData[key as keyof StudentRegistrationData]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <button
              onClick={onBack}
              className="text-white hover:text-blue-100 mb-4 flex items-center"
            >
              ← Back
            </button>
            <h2 className="text-3xl font-bold text-white">Student Registration</h2>
            <p className="text-blue-100 mt-2">Start your learning journey with ZEDU</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.grade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent/Guardian Email
                </label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.parentEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="parent@example.com"
                />
                {errors.parentEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.parentEmail}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your school name"
                />
              </div>

              {/* Academic Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects of Interest
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjectsList.map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="subjects"
                        value={subject}
                        checked={formData.subjects.includes(subject)}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Goals
                </label>
                <textarea
                  name="learningGoals"
                  value={formData.learningGoals}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="What do you hope to achieve with ZEDU?"
                />
              </div>

              {/* Security */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div className="col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I accept the Terms and Conditions and Privacy Policy *
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                    Registering...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;
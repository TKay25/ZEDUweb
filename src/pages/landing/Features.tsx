import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Video, BarChart, Users, Shield,
  CreditCard, Calendar, MessageCircle, FileText,
  Award, Globe, Clock, Bell, BookOpen,
  CheckCircle, ChevronRight, Zap, Target
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Features: React.FC = () => {
  const features = [
    {
      category: 'For Students',
      icon: BookOpen,
      color: 'bg-blue-500',
      items: [
        {
          title: 'AI-Powered Learning',
          description: 'Personalized learning paths and recommendations based on your progress',
          icon: Brain
        },
        {
          title: 'Interactive Video Lessons',
          description: 'Engaging video content with quizzes and interactive elements',
          icon: Video
        },
        {
          title: 'Progress Tracking',
          description: 'Real-time analytics and progress reports',
          icon: BarChart
        },
        {
          title: 'Study Groups',
          description: 'Collaborate with peers in virtual study groups',
          icon: Users
        },
        {
          title: 'Certificates',
          description: 'Earn recognized certificates upon course completion',
          icon: Award
        },
        {
          title: '24/7 Access',
          description: 'Learn anytime, anywhere on any device',
          icon: Globe
        }
      ]
    },
    {
      category: 'For Teachers',
      icon: Award,
      color: 'bg-green-500',
      items: [
        {
          title: 'Course Builder',
          description: 'Easy-to-use tools for creating engaging courses',
          icon: BookOpen
        },
        {
          title: 'Live Virtual Classroom',
          description: 'Real-time video sessions with screen sharing and whiteboard',
          icon: Video
        },
        {
          title: 'Automated Grading',
          description: 'Save time with automated assignment grading',
          icon: Zap
        },
        {
          title: 'Analytics Dashboard',
          description: 'Detailed insights into student performance',
          icon: Target
        },
        {
          title: 'Parent Communication',
          description: 'Built-in messaging system for parent updates',
          icon: MessageCircle
        },
        {
          title: 'Resource Library',
          description: 'Share and manage teaching materials',
          icon: FileText
        }
      ]
    },
    {
      category: 'For Parents',
      icon: Users,
      color: 'bg-purple-500',
      items: [
        {
          title: 'Progress Monitoring',
          description: 'Real-time updates on your child\'s performance',
          icon: BarChart
        },
        {
          title: 'Attendance Tracking',
          description: 'Monitor class attendance and participation',
          icon: Calendar
        },
        {
          title: 'Fee Management',
          description: 'Easy payment and invoice tracking',
          icon: CreditCard
        },
        {
          title: 'Teacher Communication',
          description: 'Direct messaging with teachers',
          icon: MessageCircle
        },
        {
          title: 'Meeting Scheduling',
          description: 'Schedule parent-teacher conferences',
          icon: Calendar
        },
        {
          title: 'Instant Alerts',
          description: 'Get notified about important updates',
          icon: Bell
        }
      ]
    },
    {
      category: 'For Schools',
      icon: Shield,
      color: 'bg-orange-500',
      items: [
        {
          title: 'Administration Dashboard',
          description: 'Comprehensive school management tools',
          icon: BarChart
        },
        {
          title: 'Staff Management',
          description: 'Manage teachers and staff efficiently',
          icon: Users
        },
        {
          title: 'Timetable Generator',
          description: 'Automated timetable creation and management',
          icon: Calendar
        },
        {
          title: 'Fee Collection',
          description: 'Streamlined payment processing',
          icon: CreditCard
        },
        {
          title: 'Compliance Reports',
          description: 'Generate reports for ministry requirements',
          icon: FileText
        },
        {
          title: 'System Security',
          description: 'Enterprise-grade security and data protection',
          icon: Shield
        }
      ]
    }
  ];

  const platformFeatures = [
    {
      title: 'Ministry Integration',
      description: 'Seamless integration with Ministry of Education requirements and reporting',
      icon: Shield
    },
    {
      title: 'Multi-language Support',
      description: 'Available in English, Shona, and Ndebele',
      icon: Globe
    },
    {
      title: 'Offline Access',
      description: 'Download content and learn without internet',
      icon: Clock
    },
    {
      title: 'Mobile Apps',
      description: 'Native apps for iOS and Android',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-primary-600"> Everyone</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're a student, teacher, parent, or school administrator,
            ZEDU has the tools you need to succeed.
          </p>
          <div className="flex justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features by Role */}
      {features.map((category, idx) => {
        const CategoryIcon = category.icon;
        return (
          <section key={idx} className={`py-20 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className={`inline-flex p-3 ${category.color} rounded-xl mb-4`}>
                  <CategoryIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {category.category}
                </h2>
                <p className="text-xl text-gray-600">
                  Tools designed specifically for your needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 ${category.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                          <FeatureIcon className={`w-6 h-6 ${category.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Platform Features */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-primary-100">
              Built for Zimbabwe, designed for the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center bg-white">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FeatureIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Seamless Integration with <span className="text-primary-600">Ministry Requirements</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                ZEDU is built to meet and exceed Zimbabwe's educational standards. Our platform automatically 
                generates reports required by the Ministry of Education, saving schools countless hours of 
                administrative work.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Automatic compliance reporting',
                  'National curriculum alignment',
                  'Real-time data sync with ministry systems',
                  'Standardized assessment tools'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button variant="primary">Learn More About Integration</Button>
              </Link>
            </div>
            <div>
              <img
                src="/images/integration-showcase.jpg"
                alt="Ministry Integration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Experience ZEDU?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users already transforming education in Zimbabwe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
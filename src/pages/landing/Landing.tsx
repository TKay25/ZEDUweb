import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Play, Star, Users, BookOpen,
  Award, Globe, Clock, Shield, TrendingUp,
  Menu, X, Mail, Phone,
  MapPin, Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Active Students', value: '50,000+', icon: Users },
    { label: 'Qualified Tutors', value: '5,000+', icon: Award },
    { label: 'Courses Available', value: '1,200+', icon: BookOpen },
    { label: 'Schools Partnered', value: '500+', icon: Globe }
  ];

  const features = [
    {
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths powered by advanced AI algorithms',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Live Interactive Classes',
      description: 'Real-time video sessions with screen sharing and whiteboard',
      icon: Play,
      color: 'bg-green-500'
    },
    {
      title: 'Progress Tracking',
      description: 'Comprehensive analytics and progress reports for students and parents',
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      title: '24/7 Access',
      description: 'Learn anytime, anywhere with our mobile-friendly platform',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Msindo',
      role: 'School Principal',
      content: 'ZEDU has transformed how we manage our school. The integration with ministry requirements is seamless.',
      rating: 5,
      image: '/avatars/avatar1.jpg'
    },
    {
      name: 'Tafadzwa Mukwena',
      role: 'Parent',
      content: 'I can now track my daughter\'s progress in real-time. The communication with teachers has never been better!',
      rating: 5,
      image: '/avatars/avatar2.jpg'
    },
    {
      name: 'Prof. James Makoni',
      role: 'Ministry of Education',
      content: 'Finally, a platform that provides national-level insights while serving local needs perfectly.',
      rating: 5,
      image: '/avatars/avatar3.jpg'
    }
  ];

  const partners = [
    { name: 'Ministry of Education', logo: '/logos/ministry.png' },
    { name: 'ZIMSEC', logo: '/logos/zimsec.png' },
    { name: 'UNICEF Zimbabwe', logo: '/logos/unicef.png' },
    { name: 'EduTECH Africa', logo: '/logos/edutech.png' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ZEDU</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-700 hover:text-primary-600 transition">Features</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary-600 transition">About</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary-600 transition">Pricing</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition">Contact</Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign Up Free</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-3">
                <Link to="/features" className="px-4 py-2 hover:bg-gray-100 rounded">Features</Link>
                <Link to="/about" className="px-4 py-2 hover:bg-gray-100 rounded">About</Link>
                <Link to="/pricing" className="px-4 py-2 hover:bg-gray-100 rounded">Pricing</Link>
                <Link to="/contact" className="px-4 py-2 hover:bg-gray-100 rounded">Contact</Link>
                <div className="border-t pt-3 mt-2">
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 rounded">Log In</Link>
                  <Link to="/register" className="block px-4 py-2 mt-2 bg-primary-600 text-white rounded-lg text-center">
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                🎓 Zimbabwe's Leading Education Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Empowering Zimbabwe's
                <span className="text-primary-600"> Future Leaders</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect students, parents, teachers, and schools in one integrated platform. 
                AI-powered learning, real-time tracking, and ministry compliance built-in.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto">
                    Get Started Free
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">4.9</span>
                </div>
                <span>•</span>
                <span>Trusted by 500+ schools</span>
                <span>•</span>
                <span>50,000+ students</span>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/hero-illustration.svg"
                alt="ZEDU Platform"
                className="w-full"
              />
              
              {/* Floating Stats */}
              <div className="absolute top-1/4 -left-8 bg-white p-4 rounded-lg shadow-xl hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Users</p>
                    <p className="font-bold">50,234</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 -right-8 bg-white p-4 rounded-lg shadow-xl hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Courses Completed</p>
                    <p className="font-bold">125,890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-3 bg-primary-100 rounded-full mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools for students, parents, teachers, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                For Students
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Learn Smarter, Not Harder
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access personalized learning paths, AI tutor assistance, and track your progress in real-time.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'AI-powered personalized learning recommendations',
                  'Interactive video lessons with quizzes',
                  'Real-time progress tracking and analytics',
                  'Certificate upon course completion',
                  'Collaborate with peers in study groups'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register?role=student">
                <Button variant="primary" size="lg">
                  Start Learning Today
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="/images/student-illustration.svg"
                alt="Student Dashboard"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Teachers Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/images/teacher-illustration.svg"
                alt="Teacher Dashboard"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                For Teachers
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Teach More Effectively
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Create engaging lessons, track student progress, and communicate seamlessly with parents.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Easy course creation and management',
                  'Automated grading and feedback',
                  'Live virtual classroom with screen sharing',
                  'Detailed analytics and reports',
                  'Parent communication portal'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register?role=tutor">
                <Button variant="primary" size="lg">
                  Start Teaching Today
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                For Parents
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Stay Connected to Your Child's Education
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Monitor progress, communicate with teachers, and manage fees all in one place.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Real-time progress and attendance tracking',
                  'Direct communication with teachers',
                  'Easy fee payment and invoice management',
                  'Schedule parent-teacher meetings',
                  'Receive instant alerts and notifications'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register?role=parent">
                <Button variant="primary" size="lg">
                  Get Started as Parent
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="/images/parent-illustration.svg"
                alt="Parent Dashboard"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Educators Across Zimbabwe
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about ZEDU
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600">Trusted by leading educational institutions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <img
                key={index}
                src={partner.logo}
                alt={partner.name}
                className="h-12 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Education?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students, parents, and educators already using ZEDU
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-xl">Z</span>
                </div>
                <span className="font-bold text-xl">ZEDU</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering Zimbabwe's future through innovative education technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white transition">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Users</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition">Student Login</a></li>
                <li><a href="/login" className="hover:text-white transition">Teacher Login</a></li>
                <li><a href="/login" className="hover:text-white transition">Parent Login</a></li>
                <li><a href="/login" className="hover:text-white transition">School Login</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@zedu.co.zw</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+263 24 270 0000</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Harare, Zimbabwe</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ZEDU. All rights reserved. Zimbabwe's Education Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Check icon component
const Check: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
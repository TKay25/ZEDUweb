import React, { useState } from 'react';
import {
  HelpCircle, Search, BookOpen, Video,
  FileText, MessageCircle, Mail, Phone,
  ExternalLink, Star,
  ThumbsUp, ThumbsDown,
  Clock, Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
// Remove unused Accordion import - we're using custom accordion
// import Accordion from '../../components/ui/Accordion';
import { toast } from 'react-hot-toast';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  views: number;
  helpful: number;
  notHelpful: number;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  format: 'video' | 'article' | 'pdf';
  url: string;
  thumbnail?: string;
  views: number;
  rating: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  messages: number;
}

// Simple helper function to format dates
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Remove unused showContactForm state
  // const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  // Sample data
  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address and you will receive a password reset link. Follow the instructions in the email to create a new password.',
      views: 1234,
      helpful: 98,
      notHelpful: 2
    },
    {
      id: '2',
      category: 'courses',
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, browse the course catalog and click on the course you\'re interested in. On the course page, click the "Enroll Now" button. Follow the prompts to complete enrollment. Some courses may require payment or approval.',
      views: 892,
      helpful: 95,
      notHelpful: 5
    },
    {
      id: '3',
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards (Visa, MasterCard), PayPal, EcoCash, and bank transfers. All payments are processed securely through our payment partners.',
      views: 756,
      helpful: 97,
      notHelpful: 3
    }
  ];

  const guides: Guide[] = [
    {
      id: '1',
      title: 'Getting Started with ZEDU',
      description: 'A complete guide for new users',
      category: 'onboarding',
      duration: '5 min',
      difficulty: 'beginner',
      format: 'video',
      url: '#',
      views: 2345,
      rating: 4.8
    },
    {
      id: '2',
      title: 'How to Create Your First Course',
      description: 'Step-by-step guide for tutors',
      category: 'courses',
      duration: '10 min',
      difficulty: 'beginner',
      format: 'article',
      url: '#',
      views: 1234,
      rating: 4.6
    },
    {
      id: '3',
      title: 'Managing Student Progress',
      description: 'Advanced features for teachers',
      category: 'teaching',
      duration: '15 min',
      difficulty: 'intermediate',
      format: 'video',
      url: '#',
      views: 892,
      rating: 4.9
    }
  ];

  const tickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: 'Unable to access course materials',
      category: 'technical',
      priority: 'high',
      status: 'in-progress',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      messages: 3
    },
    {
      id: 'TKT-002',
      subject: 'Payment not reflected',
      category: 'billing',
      priority: 'urgent',
      status: 'open',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      messages: 1
    }
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    // API call to submit ticket
    toast.success('Support ticket submitted successfully');
    // Reset form after submission
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
  };

  // Tabs configuration
  const tabs = [
    { key: 'faq', label: 'FAQ' },
    { key: 'guides', label: 'Guides & Tutorials' },
    { key: 'tickets', label: 'My Support Tickets' },
    { key: 'contact', label: 'Contact Us' }
  ];

  // Custom FAQ Accordion component
  const FAQItem = ({ faq }: { faq: FAQ }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="border rounded-lg mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-3 font-medium hover:bg-gray-50 rounded-lg flex justify-between items-center"
        >
          <span>{faq.question}</span>
          <span>{isOpen ? '▼' : '▶'}</span>
        </button>
        {isOpen && (
          <div className="px-4 pb-3">
            <p className="text-gray-700 mb-4">{faq.answer}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{faq.views} views</span>
                <span>{faq.helpful} found helpful</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Yes
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  No
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Guides & Tutorials</h3>
          <p className="text-sm text-gray-500">Step-by-step guides</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Video className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Video Tutorials</h3>
          <p className="text-sm text-gray-500">Watch and learn</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <MessageCircle className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Community Forum</h3>
          <p className="text-sm text-gray-500">Ask the community</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Mail className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Contact Support</h3>
          <p className="text-sm text-gray-500">Get direct help</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['all', 'account', 'courses', 'payments', 'technical', 'billing'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div>
            {faqs
              .filter(faq => selectedCategory === 'all' || faq.category === selectedCategory)
              .map(faq => (
                <FAQItem key={faq.id} faq={faq} />
              ))}
          </div>
        </div>
      )}

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map(guide => (
            <Card key={guide.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                  guide.format === 'video' ? 'bg-red-100' :
                  guide.format === 'article' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {guide.format === 'video' && <Video className="w-5 h-5 text-red-600" />}
                  {guide.format === 'article' && <FileText className="w-5 h-5 text-blue-600" />}
                  {guide.format === 'pdf' && <Download className="w-5 h-5 text-green-600" />}
                </div>
                <div>
                  <h3 className="font-semibold">{guide.title}</h3>
                  <p className="text-sm text-gray-500">{guide.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <Badge className="bg-gray-100 text-gray-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {guide.duration}
                </Badge>
                <Badge className={
                  guide.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  guide.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {guide.difficulty}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{guide.views} views</span>
                  <Star className="w-4 h-4 ml-2 mr-1 text-yellow-400 fill-current" />
                  {guide.rating}
                </div>
                <Button variant="outline" size="sm" onClick={() => window.open(guide.url, '_blank')}>
                  View Guide
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <Card key={ticket.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <Badge className={
                        ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {ticket.priority}
                      </Badge>
                      <Badge className={
                        ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Created {formatDate(ticket.createdAt)}
                      <span className="mx-2">•</span>
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {ticket.messages} messages
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No Support Tickets</h3>
              <p className="text-gray-500 mb-4">You haven't submitted any support tickets yet</p>
              <Button onClick={() => {
                setActiveTab('contact');
              }}>
                Create New Ticket
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Send us a message</h2>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={contactForm.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  value={contactForm.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={contactForm.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setContactForm({ ...contactForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={6}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="submit">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">support@zedu.co.zw</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">+263 24 279 1234</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Support Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri, 8:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center text-sm text-primary-600 hover:underline">
                  System Status
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <a href="#" className="flex items-center text-sm text-primary-600 hover:underline">
                  API Documentation
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <a href="#" className="flex items-center text-sm text-primary-600 hover:underline">
                  Release Notes
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
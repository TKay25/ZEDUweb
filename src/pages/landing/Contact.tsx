// src/pages/landing/Contact.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail, Phone, MapPin, Send, Clock,
  Facebook, Twitter, Linkedin, Instagram,
  MessageCircle, HelpCircle, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+263|0)[0-9]{9}$/, 'Invalid Zimbabwe phone number').optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (_data: ContactFormData) => {
    try {
      setLoading(true);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll respond within 24 hours.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const offices = [
    {
      city: 'Harare',
      address: '123 Samora Machel Avenue, Harare',
      phone: '+263 77 986 8113',
      email: 'harare@zedu.co.zw',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    {
      city: 'Bulawayo',
      address: '45 Jason Moyo Street, Bulawayo',
      phone: '+263 77 986 8113',
      email: 'bulawayo@zedu.co.zw',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    {
      city: 'Mutare',
      address: '78 Herbert Chitepo Street, Mutare',
      phone: '+263 77 986 8113',
      email: 'mutare@zedu.co.zw',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with ZEDU?',
      answer: 'Simply click the "Sign Up" button and choose your role (student, parent, teacher, or school). Follow the registration process, and you\'ll be ready to go!'
    },
    {
      question: 'Is ZEDU free to use?',
      answer: 'We offer a free tier with basic features. Premium plans with advanced features are available for schools and professional educators.'
    },
    {
      question: 'Do you offer training for schools?',
      answer: 'Yes! We provide comprehensive training and onboarding support for schools. Contact our sales team for more information.'
    },
    {
      question: 'How do you ensure data security?',
      answer: 'ZEDU uses enterprise-grade encryption and security measures. We are fully compliant with Zimbabwe\'s data protection regulations.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get in <span className="text-primary-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Have questions? We're here to help. Reach out to our team and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600 mb-1">+263 77 986 8113</p>
              <p className="text-sm text-gray-500">Mon-Fri, 8am-5pm</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600 mb-1">info@zedu.co.zw</p>
              <p className="text-sm text-gray-500">support@zedu.co.zw</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-1">Chat with our team</p>
              <p className="text-sm text-gray-500">Available 24/7</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Your Name *"
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Zita Rose"
                />

                <Input
                  label="Email Address *"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="zita@example.com"
                />

                <Input
                  label="Phone Number"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="0771234567"
                />

                {/* Native select instead of Select component */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    {...register('subject')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <Textarea
                  label="Message *"
                  {...register('message')}
                  error={errors.message?.message}
                  placeholder="How can we help you?"
                  rows={5}
                />

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register('agreeToTerms')}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-600">
                    I agree to the processing of my personal data and have read the
                    <Link to="/privacy" className="text-primary-600 hover:underline ml-1">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Office Locations */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Our Offices</h2>
              {offices.map((office, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{office.city}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <a href={`tel:${office.phone}`} className="hover:text-primary-600">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <a href={`mailto:${office.email}`} className="hover:text-primary-600">
                        {office.email}
                      </a>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Social Links */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link to="/help">
              <Button variant="outline">
                Visit Help Center
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Target, Eye, Users,  ChevronRight, Star
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const About: React.FC = () => {
  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest quality in education delivery',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      title: 'Innovation',
      description: 'Embracing technology to transform learning experiences',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Inclusivity',
      description: 'Making quality education accessible to all Zimbabweans',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Integrity',
      description: 'Operating with transparency and ethical practices',
      icon: Heart,
      color: 'bg-red-500'
    }
  ];

  const team = [
    {
      name: 'Eng. Elton Sam Shonhiwa',
      role: 'Founder & CEO',
      bio: '',
      image: '/team/elton.jpg'
    },
    {
      name: 'Mr. Takudzwa Zvakasikwa',
      role: 'Chief Education Officer',
      bio: 'PhD in Educational Technology, ....',
      image: '/team/zvaks.jpg'
    },
    {
      name: 'Eng. Michael Mtetwa',
      role: 'CTO',
      bio: 'Tech innovator with expertise in AI and learning platforms',
      image: '/team/michael.jpg'
    },
    {
      name: 'Mr. Benson Msindo',
      role: 'Head of School Relations',
      bio: 'Former school principal with 15 years leadership experience',
      image: '/team/benson.jpg'
    }
  ];

  const milestones = [
    //{ year: '2018', event: 'ZEDU founded in Harare' },
    //{ year: '2019', event: 'Launched first pilot program with 10 schools' },
    //{ year: '2020', event: 'Expanded to all 10 provinces' },
    //{ year: '2021', event: 'Reached 25,000 students milestone' },
    //{ year: '2022', event: 'Partnered with Ministry of Education' },
    //{ year: '2023', event: 'Launched AI-powered learning assistant' },
    { year: '2024', event: 'ZEDU PLATFORM INC. founded in Gweru' },
    { year: '2025', event: 'Launched AI-powered learning assistant' },
    { year: '2026', event: 'Partnered with Ministry of Education' },
    { year: '2027', event: 'Reached 25,000 students milestone' },
    { year: '2028', event: 'To reach 50,000+ active users across Zimbabwe' },
    { year: '2029', event: 'To Expanded to all 10 provinces' },
    //{ year: '2030', event: 'Partnered with Ministry of Education' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-primary-600">ZEDU</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to transform education in Zimbabwe through innovative technology,
            making quality learning accessible to every student, parent, and educator.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Get in Touch
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Born from a Vision to Transform Education
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                ZEDU was founded in 2018 by a group of educators and technologists who saw the need for 
                a comprehensive, integrated education platform tailored to Zimbabwe's unique needs.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                What started as a small project in Harare has grown into a nationwide platform serving 
                over 50,000 students across all 10 provinces. We've partnered with the Ministry of Education 
                to ensure our platform aligns with national curriculum standards while providing innovative 
                tools for modern learning.
              </p>
              <p className="text-lg text-gray-600">
                Today, ZEDU is proud to be Zimbabwe's leading education technology platform, connecting 
                students, parents, teachers, and schools in one seamless ecosystem.
              </p>
            </div>
            <div className="relative">
              <img
                src="/images/about-story.jpg"
                alt="Our Story"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl">
                <div className="text-4xl font-bold text-primary-600 mb-1">50K+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower every Zimbabwean student with access to quality education through 
                innovative technology, bridging the gap between traditional learning and modern 
                educational needs.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To create a future where every Zimbabwean student can reach their full potential 
                through personalized, accessible, and engaging education, making ZEDU the cornerstone 
                of digital learning in Africa.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div className={`w-16 h-16 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our growth
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className="flex-shrink-0 w-24 text-right mr-8">
                  <span className="text-xl font-bold text-primary-600">{milestone.year}</span>
                </div>
                <div className="relative flex-1 pl-8 pb-8 border-l-2 border-primary-200">
                  <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-primary-600 rounded-full" />
                  <p className="text-lg text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Passionate educators and technologists working to transform education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Us in Shaping the Future
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Be part of Zimbabwe's education transformation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/careers">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                View Careers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, X, Star, Zap, Shield,
  Users, BookOpen, Award, ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';

export const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Student',
      description: 'Perfect for individual learners',
      icon: BookOpen,
      monthlyPrice: 10,
      annualPrice: 96,
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'AI tutor assistance', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Study groups', included: true },
        { name: 'Certificate on completion', included: true },
        { name: 'Offline access', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced analytics', included: false }
      ],
      cta: 'Start Learning',
      popular: false
    },
    {
      name: 'Parent',
      description: 'Monitor and support your child\'s education',
      icon: Users,
      monthlyPrice: 0.1,
      annualPrice: 0.1,
      features: [
        { name: 'Track up to 3 children', included: true },
        { name: 'Real-time progress updates', included: true },
        { name: 'Teacher communication', included: true },
        { name: 'Meeting scheduling', included: true },
        { name: 'Fee management', included: true },
        { name: 'Payment reminders', included: true },
        { name: 'Multiple child dashboard', included: true },
        { name: 'Priority support', included: false }
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Teacher',
      description: 'Professional tools for educators',
      icon: Award,
      monthlyPrice: 25,
      annualPrice: 240,
      features: [
        { name: 'Create unlimited courses', included: true },
        { name: 'Live virtual classroom', included: true },
        { name: 'Automated grading', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'Parent communication', included: true },
        { name: 'Resource library', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced reporting', included: true }
      ],
      cta: 'Start Teaching',
      popular: true
    },
    {
      name: 'School',
      description: 'Complete solution for institutions',
      icon: Shield,
      monthlyPrice: 10,
      annualPrice: 1200,
      features: [
        { name: 'Unlimited students & staff', included: true },
        { name: 'Administration dashboard', included: true },
        { name: 'Staff management', included: true },
        { name: 'Timetable generator', included: true },
        { name: 'Fee collection system', included: true },
        { name: 'Compliance reporting', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'API access', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Do you offer discounts for non-profits?',
      answer: 'Yes! We offer special pricing for non-profit organizations and educational institutions. Please contact our sales team for more information.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, EcoCash, and bank transfers. School plans can also be invoiced quarterly or annually.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All plans come with a 14-day free trial. No credit card required.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-primary-600"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg ${!annual ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={annual}
              onChange={() => setAnnual(!annual)}
              className="mx-2"
            />
            <span className={`text-lg ${annual ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
              Annually
              <span className="ml-2 text-sm text-green-600 font-normal">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              const priceLabel = annual ? '/year' : '/month';

              return (
                <Card
                  key={index}
                  className={`relative p-6 ${
                    plan.popular ? 'border-2 border-primary-500 shadow-xl' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${
                      plan.popular ? 'bg-primary-600' : 'bg-gray-100'
                    } rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${
                        plan.popular ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-gray-600">{priceLabel}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.name === 'School' ? '/contact' : '/register'}>
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {plan.cta}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              We offer custom enterprise plans for large school districts, government agencies, 
              and international organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                  Contact Enterprise Sales
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  View Enterprise Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Still have questions about pricing?</p>
            <Link to="/contact">
              <Button variant="outline">
                Contact Sales
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Money-back Guarantee */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="p-8 bg-primary-50 border-primary-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <Shield className="w-12 h-12 text-primary-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    30-Day Money-Back Guarantee
                  </h3>
                  <p className="text-gray-600">
                    If you're not completely satisfied, we'll refund your payment. No questions asked.
                  </p>
                </div>
              </div>
              <Link to="/terms">
                <Button variant="outline">View Terms</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
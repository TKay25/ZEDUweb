// src/pages/common/Privacy.tsx
import React from 'react';
import {
  Shield, Lock, Eye, Database,
  Download, CheckCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Privacy: React.FC = () => {
  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, phone number, and payment information.`,
      details: [
        'Account information (name, email, password)',
        'Profile information (avatar, bio, preferences)',
        'Educational data (courses, grades, progress)',
        'Payment information (billing details)',
        'Communications (messages, support tickets)'
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform.`,
      details: [
        'To provide and personalize our services',
        'To process transactions and send receipts',
        'To communicate with you about updates and offers',
        'To monitor and analyze usage patterns',
        'To protect against fraud and abuse'
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Information Sharing',
      content: `We do not sell your personal information. We may share your information with third parties only in the following circumstances:`,
      details: [
        'With your consent',
        'With service providers who assist in operating our platform',
        'To comply with legal obligations',
        'To protect the rights and safety of our users'
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`,
      details: [
        'Encryption of data in transit and at rest',
        'Regular security assessments and audits',
        'Access controls and authentication measures',
        'Employee training on data protection'
      ]
    }
  ];

  const handleDownloadData = () => {
    toast.success('Your data export has been initiated. You will receive an email when ready.');
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to request data deletion? This action cannot be undone.')) {
      toast.success('Data deletion request submitted');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-2">Last updated: {format(new Date('2024-01-01'), 'MMMM d, yyyy')}</p>
        <p className="text-gray-600">Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {sections.map((section, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 text-primary-600">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <p className="text-gray-700 mb-4">{section.content}</p>
            <ul className="space-y-2">
              {section.details.map((detail, i) => (
                <li key={i} className="flex items-start text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{detail}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Your Rights */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You have the following rights regarding your personal information:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Right to Access</h3>
            <p className="text-sm text-gray-600">Request a copy of your personal data</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Right to Rectification</h3>
            <p className="text-sm text-gray-600">Correct inaccurate or incomplete data</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Right to Erasure</h3>
            <p className="text-sm text-gray-600">Request deletion of your data</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Right to Restriction</h3>
            <p className="text-sm text-gray-600">Limit how we use your data</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Right to Portability</h3>
            <p className="text-sm text-gray-600">Receive your data in a portable format</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Right to Object</h3>
            <p className="text-sm text-gray-600">Object to certain data processing</p>
          </div>
        </div>
      </Card>

      {/* Data Controls */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Your Data</h2>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleDownloadData}>
            <Download className="w-4 h-4 mr-2" />
            Download My Data
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDeleteData}>
            <Database className="w-4 h-4 mr-2" />
            Request Data Deletion
          </Button>
        </div>
      </Card>

      {/* Contact */}
      <Card className="p-6 bg-primary-50">
        <h2 className="text-xl font-bold mb-4">Privacy Questions?</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about our Privacy Policy or how we handle your data, please contact our Data Protection Officer:
        </p>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Email:</strong> privacy@zedu.co.zw
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> +263 779868113
          </p>
          <p className="text-sm">
            <strong>Address:</strong> Main Street Avenue, Gweru, Zimbabwe
          </p>
        </div>
      </Card>
    </div>
  );
};
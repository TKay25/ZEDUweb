// src/pages/common/Terms.tsx
import React, { useState } from 'react';
import {
  CheckCircle,
  Download,
  Printer
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Section {
  id: string;
  title: string;
  content: string;
  subsections?: Array<{
    title: string;
    content: string;
  }>;
}

export const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections: Section[] = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `Welcome to ZEDU ("the Platform"). By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
      subsections: [
        {
          title: '1.1 Acceptance of Terms',
          content: `By creating an account, accessing, or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.`
        },
        {
          title: '1.2 Eligibility',
          content: `You must be at least 18 years old to use this Platform. If you are under 18, you may only use the Platform with the consent and supervision of a parent or legal guardian.`
        }
      ]
    },
    {
      id: 'accounts',
      title: '2. Accounts and Registration',
      content: `To access certain features of the Platform, you must register for an account. You agree to provide accurate and complete information and keep it updated.`,
      subsections: [
        {
          title: '2.1 Account Security',
          content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`
        },
        {
          title: '2.2 Account Termination',
          content: `We reserve the right to suspend or terminate your account if we suspect any violation of these Terms or any illegal or unauthorized use of the Platform.`
        }
      ]
    },
    {
      id: 'content',
      title: '3. Content and Intellectual Property',
      content: `The Platform contains content owned or licensed by ZEDU. You may not copy, modify, distribute, or create derivative works without our express permission.`,
      subsections: [
        {
          title: '3.1 User Content',
          content: `You retain ownership of any content you submit to the Platform. By submitting content, you grant us a license to host, store, and display your content as necessary to provide our services.`
        },
        {
          title: '3.2 Intellectual Property Rights',
          content: `All trademarks, logos, and service marks displayed on the Platform are our property or the property of third parties. You may not use these marks without our prior written permission.`
        }
      ]
    },
    {
      id: 'privacy',
      title: '4. Privacy and Data Protection',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.`,
      subsections: [
        {
          title: '4.1 Data Collection',
          content: `We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.`
        },
        {
          title: '4.2 Data Usage',
          content: `We use your information to provide, maintain, and improve our services, communicate with you, and ensure the security of the Platform.`
        }
      ]
    },
    {
      id: 'payments',
      title: '5. Payments and Subscriptions',
      content: `Certain features of the Platform may require payment. By purchasing a subscription, you agree to pay the fees associated with your chosen plan.`,
      subsections: [
        {
          title: '5.1 Billing',
          content: `Fees are billed in advance and are non-refundable except as required by law or as expressly stated in these Terms.`
        },
        {
          title: '5.2 Cancellation',
          content: `You may cancel your subscription at any time. Cancellation will be effective at the end of your current billing period.`
        }
      ]
    },
    {
      id: 'conduct',
      title: '6. User Conduct',
      content: `You agree to use the Platform in compliance with all applicable laws and regulations.`,
      subsections: [
        {
          title: '6.1 Prohibited Activities',
          content: `You may not: (a) use the Platform for any illegal purpose; (b) harass, abuse, or harm others; (c) impersonate any person or entity; (d) interfere with the operation of the Platform; (e) upload viruses or malicious code.`
        },
        {
          title: '6.2 Enforcement',
          content: `We reserve the right to investigate and take appropriate action against any violations of these Terms, including suspending or terminating your account.`
        }
      ]
    },
    {
      id: 'liability',
      title: '7. Limitation of Liability',
      content: `To the maximum extent permitted by law, ZEDU shall not be liable for any indirect, incidental, special, consequential, or punitive damages.`,
      subsections: [
        {
          title: '7.1 Disclaimer of Warranties',
          content: `The Platform is provided "as is" without warranties of any kind, either express or implied.`
        },
        {
          title: '7.2 Limitation',
          content: `In no event shall our total liability exceed the amount you paid us during the twelve months preceding the claim.`
        }
      ]
    },
    {
      id: 'changes',
      title: '8. Changes to Terms',
      content: `We may modify these Terms from time to time. We will notify you of any material changes by posting the updated Terms on the Platform.`,
      subsections: [
        {
          title: '8.1 Continued Use',
          content: `Your continued use of the Platform after any changes constitutes your acceptance of the revised Terms.`
        }
      ]
    },
    {
      id: 'governing',
      title: '9. Governing Law',
      content: `These Terms shall be governed by the laws of Zimbabwe, without regard to its conflict of law provisions.`,
      subsections: [
        {
          title: '9.1 Dispute Resolution',
          content: `Any disputes arising under these Terms shall be resolved through binding arbitration in Harare, Zimbabwe.`
        }
      ]
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Terms downloaded as PDF');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-4">Last updated: {format(new Date('2024-01-01'), 'MMMM d, yyyy')}</p>
        <div className="flex justify-center space-x-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Quick Navigation */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-3 gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`text-left text-sm p-2 rounded hover:bg-gray-100 transition-colors ${
                activeSection === section.id ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </Card>

      {/* Terms Content */}
      <Card className="p-8">
        <div className="prose max-w-none">
          {sections.map(section => (
            <div key={section.id} id={section.id} className="mb-8 scroll-mt-20">
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
              
              {section.subsections && (
                <div className="ml-6 space-y-4">
                  {section.subsections.map((sub, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{sub.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Acceptance */}
          <div className="mt-8 p-4 bg-primary-50 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">By using ZEDU, you acknowledge that you have read and understood these Terms of Service</h3>
                <p className="text-sm text-gray-600">
                  If you have any questions about these Terms, please contact us at legal@zedu.co.zw
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
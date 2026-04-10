// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Courses', path: '/courses' },
        { label: 'For Students', path: '/students' },
        { label: 'For Tutors', path: '/tutors' },
        { label: 'For Schools', path: '/schools' },
        { label: 'Pricing', path: '/pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', path: '/blog' },
        { label: 'Help Center', path: '/help' },
        { label: 'Community', path: '/community' },
        { label: 'Webinars', path: '/webinars' },
        { label: 'Success Stories', path: '/success-stories' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' },
        { label: 'Press', path: '/press' },
        { label: 'Partners', path: '/partners' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'Accessibility', path: '/accessibility' },
        { label: 'GDPR', path: '/gdpr' },
      ],
    },
  ];

  const socialLinks = [
    { icon: '📘', label: 'Facebook', url: 'https://facebook.com' },
    { icon: '🐦', label: 'Twitter', url: 'https://twitter.com' },
    { icon: '📷', label: 'Instagram', url: 'https://instagram.com' },
    { icon: '💼', label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: '▶️', label: 'YouTube', url: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300">
                <span className="text-2xl font-bold text-white">Z</span>
              </div>
              <span className="text-2xl font-bold text-white">EDU</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Empowering education through technology. Join thousands of learners and educators worldwide.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-lg hover:bg-blue-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4 text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-400 text-sm">
                Get the latest updates on courses, features, and educational trends.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {currentYear} ZEDU. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/sitemap" className="hover:text-white transition-colors duration-200">
              Sitemap
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors duration-200">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-200">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
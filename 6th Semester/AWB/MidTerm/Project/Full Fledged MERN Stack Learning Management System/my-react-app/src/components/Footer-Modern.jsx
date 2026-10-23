import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MODERN FOOTER COMPONENT
 * Professional footer with:
 * - Multiple columns for different sections
 * - Social links
 * - Newsletter signup
 * - Copyright info
 * - Dark mode support
 */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay updated</h3>
              <p className="text-indigo-100">Get the latest courses and learning tips delivered to your inbox</p>
            </div>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                LMS
              </div>
              <span className="text-xl font-bold text-white">LMS Pro</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Empower your learning journey with world-class courses and expert instruction.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {['facebook', 'twitter', 'linkedin', 'youtube'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Become Instructor</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Report Issue</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-800 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} LMS Pro. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MODERN HERO SECTION COMPONENT
 * Eye-catching landing page hero with:
 * - Gradient background
 * - Animated elements
 * - Clear value proposition
 * - Strong CTA buttons
 * - Responsive design
 */

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Introducing LMS Pro</span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                Master <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">any skill</span> online
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn from industry experts with structured courses, real-world projects, and a supportive community. Start your learning journey today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">1,200+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Learners</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">500+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Expert Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4.9★</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/courses"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 text-center"
              >
                Browse Courses
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Trusted by leading organizations:</p>
              <div className="flex items-center gap-4 flex-wrap">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="hidden lg:block relative h-full">
            <div className="relative w-full aspect-square">
              {/* Floating cards animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl shadow-2xl opacity-10" />
              
              {/* Card 1 */}
              <div className="absolute top-8 left-8 w-48 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 transform hover:-translate-y-2 transition-transform animate-slideInUp">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Learning</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Master new skills</p>
              </div>

              {/* Card 2 */}
              <div className="absolute bottom-12 right-8 w-48 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 transform hover:translate-y-2 transition-transform" style={{ animationDelay: '0.3s', animation: 'slideInUp 0.8s ease-in-out 0.3s both' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Certified</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Earn certificates</p>
              </div>

              {/* Card 3 */}
              <div className="absolute top-1/2 right-4 w-48 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 transform -translate-y-1/2 hover:translate-x-2 transition-transform" style={{ animationDelay: '0.6s', animation: 'slideInUp 0.8s ease-in-out 0.6s both' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Community</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Connect with peers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
    </section>
  );
};

export default HeroSection;

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MODERN HOME PAGE
 * Production-grade landing page featuring:
 * - Hero section with CTA
 * - Featured courses
 * - How it works section
 * - Testimonials
 * - Call-to-action sections
 * - Responsive design
 */

const Home = () => {
  const featuredCourses = [
    {
      id: 1,
      title: 'Advanced JavaScript Mastery',
      instructor: 'John Smith',
      rating: 4.9,
      reviews: 2543,
      price: 99.99,
      image: 'https://via.placeholder.com/400x300?text=JavaScript'
    },
    {
      id: 2,
      title: 'React & Modern Web Development',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      reviews: 1892,
      price: 89.99,
      image: 'https://via.placeholder.com/400x300?text=React'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      instructor: 'Michael Brown',
      rating: 4.9,
      reviews: 1456,
      price: 79.99,
      image: 'https://via.placeholder.com/400x300?text=Design'
    },
    {
      id: 4,
      title: 'Full Stack Development',
      instructor: 'Emily Davis',
      rating: 4.7,
      reviews: 2156,
      price: 119.99,
      image: 'https://via.placeholder.com/400x300?text=FullStack'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Software Developer',
      avatar: '👨‍💼',
      quote: 'This platform transformed my career. The courses are comprehensive and the instructors are real experts.'
    },
    {
      name: 'Lisa Chen',
      role: 'UX Designer',
      avatar: '👩‍💼',
      quote: 'Amazing learning experience! I went from beginner to professional in just 3 months.'
    },
    {
      name: 'Marcus Williams',
      role: 'Entrepreneur',
      avatar: '👨‍💻',
      quote: 'The community support and quality of instruction is unmatched. Highly recommended!'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Course',
      description: 'Browse hundreds of expertly crafted courses across all skill levels and topics'
    },
    {
      number: '02',
      title: 'Learn at Your Pace',
      description: 'Study whenever and wherever you want with lifetime access to all materials'
    },
    {
      number: '03',
      title: 'Build Real Projects',
      description: 'Apply your knowledge through real-world projects and practical assignments'
    },
    {
      number: '04',
      title: 'Earn Certificates',
      description: 'Showcase your achievements with recognized certificates upon completion'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden flex items-center">
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 animate-slideInLeft">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 w-fit">
                <span className="flex w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">New AI-Powered Learning</span>
              </div>

              <div>
                <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                  Master Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Future Today</span>
                </h1>
                <p className="text-xl text-slate-700 dark:text-slate-300">Learn from industry experts with hands-on projects, real-world practice, and a thriving community of over 1 million learners.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/courses"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 text-center"
                >
                  Explore Courses
                </Link>
                <button className="px-8 py-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300">
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">1M+</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Learners</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">500+</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">4.9★</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rating</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block relative h-full animate-slideInRight">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl shadow-2xl opacity-10" />
                
                {/* Floating Cards */}
                {[
                  { delay: '0s', top: 'top-8', left: 'left-8', title: 'Course Badge' },
                  { delay: '0.3s', bottom: 'bottom-12', right: 'right-8', title: 'Certificate' },
                  { delay: '0.6s', top: 'top-1/2', right: 'right-4', title: 'Community' }
                ].map((card, i) => (
                  <div
                    key={i}
                    className={`absolute w-48 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700 ${card.top || ''} ${card.bottom || ''} ${card.left || ''} ${card.right || ''}`}
                    style={{ animation: `slideInUp 0.8s ease-in-out ${card.delay} both` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
                        <span className="text-xl">⭐</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{card.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Unlock your potential</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Four simple steps to start your learning journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-indigo-600 to-transparent" />
                )}

                {/* Card */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                  <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                Featured Courses
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Learn from industry experts</p>
            </div>
            <Link
              to="/courses"
              className="hidden lg:inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            >
              View All Courses →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">by {course.instructor}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{course.rating}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-500">({course.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${course.price}</span>
                    <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:hidden text-center mt-8">
            <Link
              to="/courses"
              className="inline-block px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Loved by Learners
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">See what our community has to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{testimonial.avatar}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join over 1 million learners already transforming their careers. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/courses"
              className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

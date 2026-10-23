import React from 'react';

/**
 * MODERN FEATURES SECTION COMPONENT
 * Showcases key platform features with icons and descriptions
 */

const FeaturesSection = () => {
  const features = [
    {
      icon: '📚',
      title: 'Comprehensive Courses',
      description: 'Access hundreds of expertly crafted courses covering all skill levels and topics'
    },
    {
      icon: '🎓',
      title: 'Industry Experts',
      description: 'Learn from professionals with real-world experience in their fields'
    },
    {
      icon: '🏆',
      title: 'Earn Certificates',
      description: 'Showcase your achievements with recognized certificates upon completion'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Visualize your learning journey with detailed progress tracking'
    },
    {
      icon: '👥',
      title: 'Community Support',
      description: 'Connect with fellow learners, share insights, and grow together'
    },
    {
      icon: '💻',
      title: 'Learn Anywhere',
      description: 'Study on your own schedule across all your devices'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to succeed in your learning goals
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Accent line */}
              <div className="mt-4 h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

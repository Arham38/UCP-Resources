import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

/**
 * MODERN COURSES PAGE
 * Production-grade courses listing with:
 * - Advanced filtering
 * - Search functionality
 * - Sorting options
 * - Grid/List view toggle
 * - Responsive design
 */

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState('grid');

  // Mock courses data
  const allCourses = [
    {
      id: 1,
      title: 'Advanced JavaScript Mastery',
      category: 'programming',
      level: 'advanced',
      instructor: 'John Smith',
      rating: 4.9,
      reviews: 2543,
      price: 99.99,
      students: 15234,
      image: 'https://via.placeholder.com/400x300?text=JavaScript'
    },
    {
      id: 2,
      title: 'React & Modern Web Development',
      category: 'programming',
      level: 'intermediate',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      reviews: 1892,
      price: 89.99,
      students: 12567,
      image: 'https://via.placeholder.com/400x300?text=React'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      category: 'design',
      level: 'beginner',
      instructor: 'Michael Brown',
      rating: 4.9,
      reviews: 1456,
      price: 79.99,
      students: 8934,
      image: 'https://via.placeholder.com/400x300?text=Design'
    },
    // Add more courses...
  ];

  const filteredCourses = useMemo(() => {
    let result = [...allCourses];

    // Search filter
    if (searchQuery) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Level filter
    if (selectedLevel !== 'all') {
      result = result.filter(course => course.level === selectedLevel);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'trending':
      default:
        result.sort((a, b) => b.students - a.students);
    }

    return result;
  }, [searchQuery, selectedLevel, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Explore All Courses
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Choose from {allCourses.length} courses and start learning today
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 sticky top-24">
              
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Search Courses
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <svg className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Level
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Levels' },
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        value={option.value}
                        checked={selectedLevel === option.value}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-4 h-4 text-indigo-600 cursor-pointer"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Categories' },
                    { value: 'programming', label: 'Programming' },
                    { value: 'design', label: 'Design' },
                    { value: 'business', label: 'Business' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={option.value}
                        checked={selectedCategory === option.value}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-indigo-600 cursor-pointer"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      className="flex-1"
                    />
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    $0 - $500
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLevel('all');
                  setSelectedCategory('all');
                }}
                className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredCourses.length}</span> courses
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="trending">Trending</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Grid view"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                      <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="List view"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Courses Grid/List */}
            {filteredCourses.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredCourses.map(course => (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    className={`group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : 'flex flex-col'
                    }`}
                  >
                    {/* Image */}
                    <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-40'} overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800`}>
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 p-4 ${viewMode === 'list' ? '' : ''}`}>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">by {course.instructor}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{course.rating}</span>
                          <span className="text-slate-500 dark:text-slate-500">({course.reviews})</span>
                        </div>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${course.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLevel('all');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * MODERN COURSE CARD COMPONENT
 * Premium course card with:
 * - Beautiful image with overlay & hover effects
 * - Star rating system
 * - Progress tracking
 * - Multiple action buttons
 * - Wishlist integration
 * - Responsive design
 */

const CourseCard = ({ 
  course, 
  onEnroll, 
  isEnrolled = false,
  progress = 0,
  showProgress = false,
  showActions = false,
  onEdit,
  onDelete
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const instructorName = course?.instructor?.name || 'Expert Instructor';
  const rating = Number(course?.avgRating || 4.5);
  const totalReviews = course?.totalReviews || 0;
  const price = course?.price || 0;

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  return (
    <article
      className="group h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Course Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="Add to wishlist"
        >
          <svg className="w-5 h-5 text-red-500 hover:fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Course Image */}
        {(course?.image || course?.thumbnail) && !imageError ? (
          <img
            src={course.image || course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Level Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
            {course?.level || 'Beginner'}
          </span>
        </div>

        {/* Enrollment Status Badge */}
        {isEnrolled && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">
              Enrolled
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col h-full">
        
        {/* Title & Instructor */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {course?.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            by <span className="font-semibold">{instructorName}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {renderStars(rating)}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              ({totalReviews.toLocaleString()})
            </span>
          </div>

          {/* Description (hidden on small screens) */}
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
            {course?.description || 'Learn new skills with expert-led courses'}
          </p>
        </div>

        {/* Progress Bar (if applicable) */}
        {showProgress && progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Progress</span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Price & Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${price.toFixed(2)}
          </span>
          
          <div className="flex gap-2">
            {!isEnrolled ? (
              <button
                onClick={() => onEnroll?.(course)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-md hover:shadow-lg flex-1 text-sm"
              >
                Enroll
              </button>
            ) : (
              <Link
                to={`/course/${course?._id}`}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-md hover:shadow-lg flex-1 text-sm text-center"
              >
                Continue
              </Link>
            )}
            
            {showActions && (
              <>
                <button
                  onClick={() => onEdit?.(course)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete?.(course)}
                  className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;

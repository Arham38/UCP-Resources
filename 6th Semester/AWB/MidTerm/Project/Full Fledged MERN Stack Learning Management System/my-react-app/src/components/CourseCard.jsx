import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import Badge from './Badge';
import Button from './Button';
import ProgressBar from './ProgressBar';
import StarRating from './StarRating';
import WishlistButton from './WishlistButton';

const CourseCard = ({
  course,
  showEnroll = false,
  onEnroll,
  isEnrolled = false,
  progress,
  showProgress = false,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const instructorName = course?.instructor?.name || 'Instructor';
  const rating = 4;
  const [imageError, setImageError] = React.useState(false);
  const currentProgress = Number(progress) || 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors duration-300 hover:border-primary-200 dark:hover:border-primary-800 dark:shadow-card-dark">
      <div className="relative h-44 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton courseId={course?._id} />
        </div>
        {(course?.image || course?.thumbnail) && !imageError ? (
          <img
            src={getImageUrl(course.image || course.thumbnail)}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <i className="bi bi-image text-4xl" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/70 to-transparent p-3">
          <Badge variant={isEnrolled ? 'enrolled' : 'upcoming'}>
            {isEnrolled ? 'Enrolled' : course?.level || 'Course'}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-bold text-text-primary">{course?.title}</h3>
          <p className="mt-1 text-sm text-text-muted">Instructor: {instructorName}</p>
          <div className="mt-3 flex items-center gap-2" aria-label={`${course?.avgRating || rating} out of 5 rating`}>
            <StarRating rating={Number(course?.avgRating || rating)} size={14} readOnly />
            <span className="text-xs text-text-muted">
              {(Number(course?.avgRating || rating)).toFixed(1)} ({course?.totalReviews || 0})
            </span>
          </div>
        </div>

        {showProgress && progress !== undefined && (
          <ProgressBar value={currentProgress} className="mt-4" />
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-bold text-primary-700 dark:text-primary-300">${course?.price}</span>
          <div className="flex flex-wrap gap-2">
            {showEnroll && !isEnrolled && (
              <Button size="sm" variant="primary" onClick={() => onEnroll?.(course)}>
                Enroll Now
              </Button>
            )}
            {showEnroll && isEnrolled && (
              <Link
                to={`/course/${course?._id}`}
                className="inline-flex items-center justify-center rounded-lg bg-secondary-600 px-3 py-1.5 text-xs font-semibold text-white no-underline transition-colors duration-300 hover:bg-secondary-700 dark:bg-secondary-400 dark:text-neutral-950"
              >
                Continue
              </Link>
            )}
            {!showEnroll && (
              <Link
                to={`/course/${course?._id}`}
                className="inline-flex items-center justify-center rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-700 no-underline transition-colors duration-300 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-200 dark:hover:bg-primary-900/30"
              >
                View
              </Link>
            )}
            {showActions && (
              <>
                <Button size="sm" variant="ghost" onClick={() => onEdit?.(course)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete?.(course)}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;

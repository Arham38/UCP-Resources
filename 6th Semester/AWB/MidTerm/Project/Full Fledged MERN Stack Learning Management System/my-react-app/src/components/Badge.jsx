import React from 'react';

const badgeStyles = {
  enrolled: 'bg-info-100 text-info-700 ring-info-200 dark:bg-info-900/40 dark:text-info-200 dark:ring-info-800',
  completed:
    'bg-success-100 text-success-700 ring-success-200 dark:bg-success-900/40 dark:text-success-200 dark:ring-success-800',
  inProgress:
    'bg-primary-100 text-primary-700 ring-primary-200 dark:bg-primary-900/40 dark:text-primary-200 dark:ring-primary-800',
  upcoming:
    'bg-secondary-100 text-secondary-700 ring-secondary-200 dark:bg-secondary-900/40 dark:text-secondary-200 dark:ring-secondary-800',
  overdue:
    'bg-danger-100 text-danger-700 ring-danger-200 dark:bg-danger-900/40 dark:text-danger-200 dark:ring-danger-800',
  warning:
    'bg-warning-100 text-warning-800 ring-warning-200 dark:bg-warning-900/40 dark:text-warning-100 dark:ring-warning-800',
  neutral:
    'bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700',
};

const labelMap = {
  enrolled: 'Enrolled',
  completed: 'Completed',
  inProgress: 'In Progress',
  upcoming: 'Upcoming',
  overdue: 'Overdue',
  warning: 'Pending',
  neutral: 'Draft',
};

const Badge = ({ variant = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition-colors duration-300 ${
      badgeStyles[variant] || badgeStyles.neutral
    } ${className}`}
  >
    {children || labelMap[variant] || labelMap.neutral}
  </span>
);

export default Badge;

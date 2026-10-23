import React from 'react';

const alertStyles = {
  success: {
    icon: 'M9 12.75 11.25 15 15 9.75',
    classes:
      'border-success-200 bg-success-50 text-success-800 dark:border-success-800 dark:bg-success-900/30 dark:text-success-100',
  },
  warning: {
    icon: 'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
    classes:
      'border-warning-200 bg-warning-50 text-warning-900 dark:border-warning-800 dark:bg-warning-900/30 dark:text-warning-100',
  },
  error: {
    icon: 'M6 18 18 6M6 6l12 12',
    classes:
      'border-danger-200 bg-danger-50 text-danger-800 dark:border-danger-800 dark:bg-danger-900/30 dark:text-danger-100',
  },
  info: {
    icon: 'M12 16v-4m0-4h.01',
    classes:
      'border-info-200 bg-info-50 text-info-800 dark:border-info-800 dark:bg-info-900/30 dark:text-info-100',
  },
};

const Alert = ({ type = 'info', title, children, className = '' }) => {
  const alert = alertStyles[type] || alertStyles.info;

  return (
    <div className={`flex gap-3 rounded-xl border p-4 transition-colors duration-300 ${alert.classes} ${className}`}>
      <svg className="mt-0.5 h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={alert.icon} />
      </svg>
      <div>
        {title && <p className="mb-1 text-sm font-semibold">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

export default Alert;

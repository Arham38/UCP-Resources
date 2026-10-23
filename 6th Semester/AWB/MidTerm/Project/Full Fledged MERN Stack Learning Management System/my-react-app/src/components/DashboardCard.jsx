import React from 'react';

const colorClasses = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-200',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-200',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-100',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-200',
  info: 'bg-info-100 text-info-700 dark:bg-info-900/40 dark:text-info-200',
};

const DashboardCard = ({ title, value, icon, color = 'primary', trend, className = '' }) => (
  <section
    className={`rounded-xl border border-border bg-surface p-5 shadow-card transition-colors duration-300 dark:shadow-card-dark ${className}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-text-muted">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-normal text-text-primary">{value}</p>
        {trend && <p className="mt-2 text-xs font-medium text-success-600 dark:text-success-300">{trend}</p>}
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color] || colorClasses.primary}`}>
        {typeof icon === 'string' ? <i className={`bi bi-${icon}`} aria-hidden="true" /> : icon}
      </div>
    </div>
  </section>
);

export default DashboardCard;

import React, { useState } from 'react';

/**
 * MODERN DASHBOARD CARD COMPONENT
 * Premium dashboard card for displaying various types of content
 * Used throughout admin/instructor/student dashboards
 */

const DashboardCard = ({
  title,
  subtitle,
  content,
  footer,
  icon: Icon,
  variant = 'default',
  size = 'md',
  hoverable = true,
  onClick,
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    primary: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-800',
    success: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800',
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        rounded-2xl border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${hoverable ? 'cursor-pointer hover:shadow-lg transition-all duration-300' : ''}
        shadow-md
        ${className}
      `.trim()}
      onClick={onClick}
    >
      {/* Header */}
      {(title || Icon) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className="ml-4 p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {content && (
        <div className="mb-4">
          {typeof content === 'string' ? (
            <p className="text-slate-700 dark:text-slate-300">
              {content}
            </p>
          ) : (
            content
          )}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          {typeof footer === 'string' ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {footer}
            </p>
          ) : (
            footer
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;

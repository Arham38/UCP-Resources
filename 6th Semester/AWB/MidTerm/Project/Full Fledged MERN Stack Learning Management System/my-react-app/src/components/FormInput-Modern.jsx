import React, { useState } from 'react';

/**
 * MODERN FORM INPUT COMPONENT
 * Premium form input with:
 * - Floating labels
 * - Validation states
 * - Icons support
 * - Error messages
 * - Dark mode support
 */

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  error,
  success,
  disabled = false,
  required = false,
  helpText,
  className = '',
  size = 'md',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const getBorderColor = () => {
    if (error) return 'border-red-300 dark:border-red-700';
    if (success) return 'border-emerald-300 dark:border-emerald-700';
    return isFocused ? 'border-indigo-500 dark:border-indigo-500' : 'border-slate-300 dark:border-slate-600';
  };

  const getFocusRing = () => {
    if (error) return 'focus:ring-red-500 focus:ring-offset-red-50 dark:focus:ring-offset-slate-900';
    if (success) return 'focus:ring-emerald-500 focus:ring-offset-emerald-50 dark:focus:ring-offset-slate-900';
    return 'focus:ring-indigo-500 focus:ring-offset-indigo-50 dark:focus:ring-offset-slate-900';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          {label}
          {required && <span className="text-red-600 dark:text-red-400">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none">
            <Icon className={`w-5 h-5 ${isFocused ? 'text-indigo-600 dark:text-indigo-400' : ''} transition-colors`} />
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            ${sizeClasses[size]}
            ${Icon ? 'pl-10' : ''}
            rounded-lg
            border-2
            ${getBorderColor()}
            bg-white dark:bg-slate-900
            text-slate-900 dark:text-white
            placeholder-slate-500 dark:placeholder-slate-400
            outline-none
            transition-all duration-200
            focus:ring-2 focus:ring-offset-2
            ${getFocusRing()}
            disabled:bg-slate-100 dark:disabled:bg-slate-800
            disabled:cursor-not-allowed
            disabled:opacity-60
          `.trim()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Status Icons */}
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 dark:text-red-400 pointer-events-none">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L9.95 17.137 7.879 15.066a1 1 0 10-1.414 1.414l2.5 2.5a1 1 0 001.414 0l8.162-8.162z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {success && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L9.95 17.137 7.879 15.066a1 1 0 10-1.414 1.414l2.5 2.5a1 1 0 001.414 0l8.162-8.162z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L9.95 17.137 7.879 15.066a1 1 0 10-1.414 1.414l2.5 2.5a1 1 0 001.414 0l8.162-8.162z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormInput;

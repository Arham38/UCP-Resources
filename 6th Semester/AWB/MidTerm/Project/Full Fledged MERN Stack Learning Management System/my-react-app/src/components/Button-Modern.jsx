import React from 'react';

/**
 * MODERN BUTTON COMPONENT
 * Premium design with multiple variants, sizes, and states
 * Includes loading, disabled, icon support, and smooth interactions
 */

const buttonVariants = {
  // Primary - Main call-to-action button
  primary: {
    base: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 active:shadow-md active:from-indigo-800 active:to-indigo-900',
    dark: 'dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 dark:active:from-indigo-700 dark:active:to-indigo-800',
    disabled: 'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none'
  },
  
  // Secondary - Less prominent action
  secondary: {
    base: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200',
    dark: 'dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:border-slate-700',
    disabled: 'disabled:opacity-60 disabled:cursor-not-allowed'
  },
  
  // Success - Positive actions
  success: {
    base: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-md hover:shadow-lg',
    dark: 'dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:active:bg-emerald-800',
    disabled: 'disabled:opacity-60 disabled:cursor-not-allowed'
  },
  
  // Danger - Destructive actions
  danger: {
    base: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg',
    dark: 'dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800',
    disabled: 'disabled:opacity-60 disabled:cursor-not-allowed'
  },
  
  // Ghost - Minimal, transparent
  ghost: {
    base: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 border border-transparent',
    dark: 'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
    disabled: 'disabled:opacity-60 disabled:cursor-not-allowed'
  },
  
  // Outline - Bordered variant
  outline: {
    base: 'bg-transparent text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 border border-indigo-200',
    dark: 'dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:active:bg-indigo-900/50 dark:border-indigo-800',
    disabled: 'disabled:opacity-60 disabled:cursor-not-allowed'
  }
};

const buttonSizes = {
  xs: 'px-3 py-1.5 text-xs font-medium rounded-md',
  sm: 'px-4 py-2 text-sm font-medium rounded-lg',
  md: 'px-5 py-2.5 text-base font-medium rounded-lg',
  lg: 'px-6 py-3 text-lg font-medium rounded-xl',
  xl: 'px-8 py-4 text-lg font-semibold rounded-xl'
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}) => {
  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    dark:focus:ring-offset-slate-900
    ${sizeClasses}
    ${variantClasses.base}
    ${variantClasses.dark}
    ${variantClasses.disabled}
  `.trim();
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" aria-hidden="true" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" aria-hidden="true" />}
        </>
      )}
    </button>
  );
};

export default Button;

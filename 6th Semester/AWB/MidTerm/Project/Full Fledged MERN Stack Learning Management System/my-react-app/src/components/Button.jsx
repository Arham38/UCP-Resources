import React from 'react';

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 lms-focus-ring disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary:
    'bg-primary-600 text-white shadow-sm hover:bg-primary-700 dark:bg-primary-400 dark:text-neutral-950 dark:hover:bg-primary-300',
  secondary:
    'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 dark:bg-secondary-900/60 dark:text-secondary-100 dark:hover:bg-secondary-800',
  success:
    'bg-success-600 text-white hover:bg-success-700 dark:bg-success-400 dark:text-neutral-950 dark:hover:bg-success-300',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 dark:bg-danger-400 dark:text-neutral-950 dark:hover:bg-danger-300',
  ghost:
    'bg-transparent text-text-secondary hover:bg-neutral-100 hover:text-text-primary dark:hover:bg-neutral-800',
  disabled:
    'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const resolvedVariant = disabled ? 'disabled' : variant;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variants[resolvedVariant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

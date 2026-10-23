import React, { useId } from 'react';

const FormInput = ({
  label,
  error,
  hint,
  className = '',
  inputClassName = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${inputId}-helper` : undefined}
        className={`block w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-300 lms-focus-ring ${
          error
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-border focus:border-primary-500 dark:focus:border-primary-400'
        } ${inputClassName}`}
        {...props}
      />
      {(error || hint) && (
        <p
          id={`${inputId}-helper`}
          className={`mt-1.5 text-xs ${error ? 'text-danger-600 dark:text-danger-300' : 'text-text-muted'}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default FormInput;

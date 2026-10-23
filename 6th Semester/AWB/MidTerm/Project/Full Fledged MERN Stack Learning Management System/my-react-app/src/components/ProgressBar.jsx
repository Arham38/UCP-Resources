import React from 'react';

const getLevelClasses = (value) => {
  if (value < 35) return 'bg-danger-500 dark:bg-danger-400';
  if (value < 70) return 'bg-warning-500 dark:bg-warning-400';
  return 'bg-success-500 dark:bg-success-400';
};

const ProgressBar = ({ value = 0, showLabel = true, className = '' }) => {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-text-muted">
          <span>Progress</span>
          <span>{safeValue}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getLevelClasses(safeValue)}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

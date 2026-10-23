import React from 'react';

/**
 * MODERN STATS CARD COMPONENT
 * Displays key metrics with icons, values, and trends
 */

const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend = null, 
  color = 'indigo',
  size = 'md' 
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  };

  const sizeClasses = {
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  };

  const trendColor = trend?.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-xl`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trend.positive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
            </svg>
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

export default StatsCard;

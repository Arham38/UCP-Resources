import React from 'react';
import Badge from './Badge';
import Button from './Button';

const StudentProfileCard = ({ student, stats = [], onMessage, onViewProfile }) => (
  <section className="rounded-xl border border-border bg-surface p-5 shadow-card transition-colors duration-300 dark:shadow-card-dark">
    <div className="flex items-center gap-4">
      <img
        src={student?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Student')}&background=4F46E5&color=fff`}
        alt={student?.name || 'Student'}
        className="h-14 w-14 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-800"
      />
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-text-primary">{student?.name || 'Student Name'}</h3>
        <div className="mt-1">
          <Badge variant="enrolled">{student?.role || 'Student'}</Badge>
        </div>
      </div>
    </div>
    <dl className="mt-5 grid grid-cols-3 gap-3">
      {stats.map((item) => (
        <div key={item.label} className="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-900/40">
          <dt className="text-xs text-text-muted">{item.label}</dt>
          <dd className="mt-1 text-lg font-bold text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
    <div className="mt-5 flex gap-2">
      <Button className="flex-1" variant="primary" onClick={onViewProfile}>Profile</Button>
      <Button className="flex-1" variant="ghost" onClick={onMessage}>Message</Button>
    </div>
  </section>
);

export default StudentProfileCard;

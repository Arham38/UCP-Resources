import React from 'react';
import Button from './Button';

const Modal = ({ open, title, children, footer, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-card transition-colors duration-300 dark:shadow-card-dark">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted transition-colors duration-300 hover:bg-neutral-100 hover:text-text-primary dark:hover:bg-neutral-800 lms-focus-ring"
            aria-label="Close dialog"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="px-5 py-4 text-sm text-text-secondary">{children}</div>
        <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
          {footer || <Button variant="primary" onClick={onClose}>Done</Button>}
        </footer>
      </section>
    </div>
  );
};

export default Modal;

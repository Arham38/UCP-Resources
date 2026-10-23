import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ items = [] }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex min-h-screen w-64 flex-none flex-col border-r border-border bg-surface-sidebar text-text-primary transition-colors duration-300">
      <div className="border-b border-border p-5">
        <p className="text-xs font-semibold uppercase tracking-normal text-text-muted">Workspace</p>
        <h2 className="mt-1 text-lg font-bold">LMS Dashboard</h2>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold no-underline transition-colors duration-300 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100 dark:bg-primary-900/40 dark:text-primary-200 dark:ring-primary-800'
                  : 'text-text-secondary hover:bg-neutral-100 hover:text-text-primary dark:hover:bg-neutral-800'
              }`
            }
          >
            <i className={`bi bi-${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-text-secondary transition-colors duration-300 hover:bg-danger-50 hover:text-danger-700 dark:hover:bg-danger-900/30 dark:hover:text-danger-200"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-left" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

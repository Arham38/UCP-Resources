import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

const BrandIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5" />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'instructor') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  const linkClasses = (to) => {
    const active = location.pathname === to;
    return `rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
      active
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
        : 'text-text-secondary hover:bg-neutral-100 hover:text-text-primary dark:hover:bg-neutral-800'
    }`;
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-surface-navbar/95 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary-700 no-underline dark:text-primary-300">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white dark:bg-primary-400 dark:text-neutral-950">
            <BrandIcon />
          </span>
          LMS
        </Link>

        <button
          type="button"
          className="rounded-lg border border-border p-2 text-text-secondary transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
          onClick={() => setShowMenu((value) => !value)}
          aria-expanded={showMenu}
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </button>

        <div className={`${showMenu ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-3 border-b border-border bg-surface px-4 py-4 shadow-card dark:shadow-card-dark lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
          <div className="flex flex-col gap-1 lg:flex-1 lg:flex-row lg:items-center lg:justify-center">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClasses(link.to)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <ThemeToggle />
            {user && <NotificationDropdown />}
            {user ? (
              <>
                <Link to={getDashboardPath()} className={linkClasses(getDashboardPath())}>
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text-secondary transition-colors duration-300 hover:bg-danger-50 hover:text-danger-700 dark:hover:bg-danger-900/30 dark:hover:text-danger-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClasses('/login')}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white no-underline transition-colors duration-300 hover:bg-primary-700 dark:bg-primary-400 dark:text-neutral-950 dark:hover:bg-primary-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

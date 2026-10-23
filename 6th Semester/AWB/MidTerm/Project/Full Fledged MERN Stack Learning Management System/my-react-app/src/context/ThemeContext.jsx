import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { store } from '../store/index.js';
import { setDarkMode } from '../store/slices/uiSlice';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'theme';

const applyTheme = (isDark) => {
  document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('theme-dark', isDark);
  document.documentElement.classList.toggle('theme-light', !isDark);
  store.dispatch(setDarkMode(isDark));
};

const getInitialDark = () => {
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
    return true;
  }
  if (localStorage.theme === 'light') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const dark = getInitialDark();
    applyTheme(dark);
    return dark;
  });

  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (localStorage.getItem(STORAGE_KEY) === null) setIsDark(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);
  const setLight    = useCallback(() => setIsDark(false), []);
  const setDarkFn   = useCallback(() => setIsDark(true), []);

  return (
    <ThemeContext.Provider value={{ isDark, theme: isDark ? 'dark' : 'light', toggleTheme, setLight, setDark: setDarkFn }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook in its own export — satisfies fast-refresh rule
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};

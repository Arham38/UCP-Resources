import { createSlice } from '@reduxjs/toolkit';

// Source of truth for theme is ThemeContext / localStorage key 'lms-theme'.
// This slice mirrors that value so Redux-connected components still work.
const getInitialDark = () => {
  const stored = localStorage.getItem('lms-theme');
  if (stored !== null) return stored === 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: getInitialDark(),
    sidebarOpen: true,
  },
  reducers: {
    // Called by ThemeContext to keep Redux in sync — do NOT touch DOM here
    setDarkMode(state, action) {
      state.darkMode = action.payload;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setDarkMode, setSidebarOpen } = uiSlice.actions;
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;

export default uiSlice.reducer;

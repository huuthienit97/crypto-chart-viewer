import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      background: '#1a1a1a',
      surface: '#2d2d2d',
      primary: '#00d4aa',
      secondary: '#ff6b6b',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      chart: '#00d4aa',
      chartNegative: '#ff6b6b',
      header: '#2d2d2d',
      card: '#333333'
    } : {
      background: '#ffffff',
      surface: '#f8f9fa',
      primary: '#00d4aa',
      secondary: '#ff6b6b',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      chart: '#00d4aa',
      chartNegative: '#ff6b6b',
      header: '#ffffff',
      card: '#ffffff'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 
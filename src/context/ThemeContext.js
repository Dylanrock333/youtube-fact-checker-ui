import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Always use dark mode - simplified for now
  const isDarkMode = true;
  const theme = 'dark';

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      theme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 
import React, { createContext, useState, useContext, useEffect } from 'react';

const AnalysisContext = createContext();

export function AnalysisProvider({ children }) {
  // Get initial state from localStorage if available
  const [analysisData, setAnalysisData] = useState(() => {
    const savedData = localStorage.getItem('analysisData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // Save to localStorage whenever analysisData changes
  useEffect(() => {
    if (analysisData) {
      localStorage.setItem('analysisData', JSON.stringify(analysisData));
    }
  }, [analysisData]);

  // Function to clear analysis data
  const clearAnalysisData = () => {
    localStorage.removeItem('analysisData');
    setAnalysisData(null);
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData, clearAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
} 
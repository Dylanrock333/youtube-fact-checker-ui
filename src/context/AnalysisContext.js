import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisContext = createContext();

export function AnalysisProvider({ children }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // You could add persistence to localStorage here if you want a hybrid approach
  // that survives page refreshes
  
  useEffect(() => {
    try {
      // Load from localStorage instead of sessionStorage
      const savedData = localStorage.getItem('analysisData');
      const savedUrl = localStorage.getItem('analyzedVideoUrl');

      if (savedData) setAnalysisData(JSON.parse(savedData));
      if (savedUrl) setVideoUrl(savedUrl);

      // Clean up old language selection from localStorage
      localStorage.removeItem('selectedLanguage');
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Optionally clear corrupted storage
      // localStorage.removeItem('analysisData');
      // localStorage.removeItem('analyzedVideoUrl');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    // Only save if initialized to prevent overwriting loaded data with initial nulls
    if (isInitialized) {
        if (analysisData) {
          // Save to localStorage
          localStorage.setItem('analysisData', JSON.stringify(analysisData));
        } else {
          // Optional: Remove item if data becomes null/undefined after initialization
          localStorage.removeItem('analysisData');
        }

        if (videoUrl) {
          // Save to localStorage
          localStorage.setItem('analyzedVideoUrl', videoUrl);
        } else {
            // Optional: Remove item if URL becomes empty after initialization
          localStorage.removeItem('analyzedVideoUrl');
        }
    }
  }, [analysisData, videoUrl, isInitialized]);


  // Save search results to localStorage
  const setDeepSearchResult = (result) => {
    localStorage.setItem(`deep-search`, JSON.stringify(result));
  };

  return (
    <AnalysisContext.Provider 
      value={{ 
        analysisData, 
        setAnalysisData, 
        videoUrl, 
        setVideoUrl,
        isAnalyzing,
        setIsAnalyzing,
        isInitialized,
        setDeepSearchResult
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
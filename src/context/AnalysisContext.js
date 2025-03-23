import React, { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext();

export function AnalysisProvider({ children }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // You could add persistence to localStorage here if you want a hybrid approach
  // that survives page refreshes
  React.useEffect(() => {
    // Load from localStorage on initial mount
    const savedData = localStorage.getItem('analysisData');
    const savedUrl = localStorage.getItem('analyzedVideoUrl');
    
    if (savedData) setAnalysisData(JSON.parse(savedData));
    if (savedUrl) setVideoUrl(savedUrl);
  }, []);

  // Save to localStorage when data changes
  React.useEffect(() => {
    if (analysisData) {
      localStorage.setItem('analysisData', JSON.stringify(analysisData));
    }
    if (videoUrl) {
      localStorage.setItem('analyzedVideoUrl', videoUrl);
    }
  }, [analysisData, videoUrl]);

  return (
    <AnalysisContext.Provider 
      value={{ 
        analysisData, 
        setAnalysisData, 
        videoUrl, 
        setVideoUrl,
        isAnalyzing,
        setIsAnalyzing
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
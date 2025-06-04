import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisContext = createContext();

const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', code: 'en' },
  'es': { name: 'Español', code: 'es' },
  'fr': { name: 'Français', code: 'fr' },
  'de': { name: 'Deutsch', code: 'de' },
  'pt': { name: 'Português', code: 'pt' },
  'it': { name: 'Italiano', code: 'it' },
  'ja': { name: '日本語', code: 'ja' },
  'zh': { name: '中文', code: 'zh-cn' },
  'ru': { name: 'Русский', code: 'ru' }
};

export function AnalysisProvider({ children }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Check localStorage first, then browser, then default to English
    const saved = localStorage.getItem('selectedLanguage');
    if (saved && SUPPORTED_LANGUAGES[saved]) return saved;
    
    const browserLang = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES[browserLang] ? browserLang : 'en';
  });

  useEffect(() => {
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  // You could add persistence to localStorage here if you want a hybrid approach
  // that survives page refreshes
  
  useEffect(() => {
    try {
      // Load from sessionStorage instead of localStorage
      const savedData = sessionStorage.getItem('analysisData');
      const savedUrl = sessionStorage.getItem('analyzedVideoUrl');

      if (savedData) setAnalysisData(JSON.parse(savedData));
      if (savedUrl) setVideoUrl(savedUrl);
    } catch (error) {
      console.error("Error loading data from sessionStorage:", error);
      // Optionally clear corrupted storage
      // sessionStorage.removeItem('analysisData');
      // sessionStorage.removeItem('analyzedVideoUrl');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to sessionStorage when data changes
  useEffect(() => {
    // Only save if initialized to prevent overwriting loaded data with initial nulls
    if (isInitialized) {
        if (analysisData) {
          // Save to sessionStorage
          sessionStorage.setItem('analysisData', JSON.stringify(analysisData));
        } else {
          // Optional: Remove item if data becomes null/undefined after initialization
          sessionStorage.removeItem('analysisData');
        }

        if (videoUrl) {
          // Save to sessionStorage
          sessionStorage.setItem('analyzedVideoUrl', videoUrl);
        } else {
            // Optional: Remove item if URL becomes empty after initialization
          sessionStorage.removeItem('analyzedVideoUrl');
        }
    }
  }, [analysisData, videoUrl, isInitialized]);


  // Save search results to sessionStorage
  const setDeepSearchResult = (result) => {
    sessionStorage.setItem(`deep-search`, JSON.stringify(result));
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
        setDeepSearchResult,
        currentLanguage, 
        setCurrentLanguage, 
        SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
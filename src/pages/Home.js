import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideo, checkApiHealth } from '../api/youtubeApi';
import VideoAnalysis from '../components/items/VideoAnalysis';
import '../styles/Home.css';

function Home() {
  const [inputText, setInputText] = useState('');
  const { isDarkMode } = useTheme();
  const { analysisData, setAnalysisData } = useAnalysis();
  const [apiStatus, setApiStatus] = useState({ loading: true, success: null });
  const [analyzing, setAnalyzing] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAnalyzeClick = async () => {
    if (!inputText.trim()) return;
    
    setAnalyzing(true);
    try {
      const response = await analyzeVideo(inputText);
      setAnalysisData(response); // This will also save to localStorage
    } catch (error) {
      console.error('Error analyzing video:', error);
      setAnalysisData({ error: error.message });
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await checkApiHealth();
        setApiStatus({ loading: false, success: result.success });
      } catch (error) {
        setApiStatus({ loading: false, success: false });
      }
    };
    
    checkHealth();
  }, []);

  // Add event listener for beforeunload to clear localStorage on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('analysisData');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="home">
      <h1>YouTube Video Fact Checker</h1>
      <div className="api-status-indicator">
        API Status: 
        {apiStatus.loading ? (
          <span className="loading">Loading...</span>
        ) : apiStatus.success ? (
          <span className="success">✓</span>
        ) : (
          <span className="error">✗</span>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter YouTube video URL here ..."
          className={`main-input ${isDarkMode ? 'dark' : 'light'}`}
          disabled={analyzing}
        />
      </div>
      <div className="button-container">
        <button 
          onClick={handleAnalyzeClick}
          className={`analyze-button ${isDarkMode ? 'dark' : 'light'}`}
          disabled={analyzing || !apiStatus.success}
        >
          {analyzing ? (
            <span className="loading-spinner"></span>
          ) : (
            'Analyze Video'
          )}
        </button>
      </div>
      {analysisData && (
        <div className={`result-container ${isDarkMode ? 'dark' : 'light'}`}>
          {analysisData.error ? (
            <div className="error-message">{analysisData.error}</div>
          ) : (
            <VideoAnalysis 
              analysisData={analysisData} 
              isDarkMode={isDarkMode}
              videoUrl={inputText}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Home; 
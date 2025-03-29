import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideo, checkApiHealth } from '../api/youtubeApi';
import VideoAnalysis from '../components/items/VideoAnalysis';
import '../styles/Home.css';

function Home() {
  const [inputText, setInputText] = useState('');
  const { theme } = useTheme();
  const { 
    analysisData, 
    setAnalysisData, 
    videoUrl, 
    setVideoUrl, 
    isAnalyzing, 
    setIsAnalyzing 
  } = useAnalysis();
  const [apiStatus, setApiStatus] = useState({ loading: true, success: null });

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAnalyzeClick = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setVideoUrl(inputText);
    
    try {
      const response = await analyzeVideo(inputText);
      setAnalysisData(response);
    } catch (error) {
      console.error('Error analyzing video:', error);
      setAnalysisData({ error: error.message });
    } finally {
      setIsAnalyzing(false);
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
          className={`main-input ${theme}`}
          disabled={isAnalyzing}
        />
      </div>
      <div className="button-container">
        <button 
          onClick={handleAnalyzeClick}
          className={`analyze-button ${theme} ${isAnalyzing ? 'disabled' : ''}`}
          disabled={isAnalyzing || !apiStatus.success}
        >
          Analyze Video
        </button>
      </div>    
      {(isAnalyzing || analysisData) && (
        <div className={`result-container ${theme}`}>
          {isAnalyzing ? (
            <div className="analysis-loading">
              <div className="loading-spinner-large"></div>
              <p>Analyzing video...</p>
            </div>
          ) : (
            analysisData && (
              analysisData.error ? (
                <div className="error-message">{analysisData.error}</div>
              ) : (   
                <VideoAnalysis 
                  analysisData={analysisData}
                  videoUrl={videoUrl}
                />
              )
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Home; 
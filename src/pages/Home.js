import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { checkApiHealth } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Hexagon from '../assets/hexagon-static.svg';
import '../styles/Home.css';

//TODO: add the video duration
function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {isAnalyzing, setIsAnalyzing, setVideoUrl} = useAnalysis();
  const [apiStatus, setApiStatus] = useState({ loading: true, success: null });

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
  };

  const handleAnalyzeClick = async () => {
    if (!inputUrl.trim()) return;

    setIsAnalyzing(true);
    setVideoUrl(inputUrl);

    navigate("/analysis-page");
    
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

  const isDev = process.env.NODE_ENV === 'development';
  const apiStatusIndicator = isDev ? (
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
  ) : null; 

  return (
    <div className="home">
      <div className="home-header">
        <h1>Video Claim Catcher</h1>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputUrl}
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
    </div>
  );
}

export default Home; 
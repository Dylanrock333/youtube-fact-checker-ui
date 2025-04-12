import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideo, checkApiHealth } from '../api/api';
import VideoAnalysis from '../components/items/VideoAnalysis';
import validateUrl from '../utils/urlDecoder';
import '../styles/Home.css';
import hexagonLoading from '../assets/hexagon-loading.svg';

//TODO: remove or blend in some of the backgrounf componenets
//TODO: add the video duration
function Home() {
  const [inputUrl, setInputUrl] = useState('');
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
    setInputUrl(e.target.value);
  };

  const handleAnalyzeClick = async () => {
    if (!inputUrl.trim()) return;
    
    setIsAnalyzing(true);
    
    
    try {
      const { origin, videoID } = validateUrl(inputUrl);

      setVideoUrl(inputUrl); 

      const response = await analyzeVideo(inputUrl, origin, videoID);
      console.log(response);
      
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
      <h1>YouTube Video Fact Checker</h1>
      {process.env.NODE_ENV}
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
      {(isAnalyzing || analysisData) && (
        <div className={`result-container ${theme}`}>
          {isAnalyzing ? (
            <div className="analysis-loading">
              <div className="loading-container">
                  <object type="image/svg+xml" data={hexagonLoading} className="loading-hexagon">
                      Loading animation
                  </object>
                  <p>Analyzing video...</p>
              </div>
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
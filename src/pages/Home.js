import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { checkApiHealth} from '../api/api';
import { useNavigate } from 'react-router-dom';
import validateUrl from '../utils/urlDecoder';
import '../styles/Home.css';
import Slideshow from '../components/items/slideshow';
import Analytics from '../utils/analytics';

//TODO: add the video duration
function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const navigate = useNavigate();
  const { isAnalyzing, setIsAnalyzing, setVideoUrl } = useAnalysis();
  const [apiStatus, setApiStatus] = useState({ loading: true, success: null });
  const [rateLimitMessage, setRateLimitMessage] = useState('');
  const [urlError, setUrlError] = useState('');
  const [pageLoadTime] = useState(Date.now());
  

  useEffect(() => {
    const checkStoredRateLimit = () => {
      const storedInfo = sessionStorage.getItem('rateLimitInfo');
      if (storedInfo) {
        const info = JSON.parse(storedInfo);
        if (info.isLimited && new Date(info.resetTime) > new Date()) {
          const resetDate = new Date(info.resetTime);
          setRateLimitMessage(`Rate limit reached. Please try again after ${resetDate.toLocaleTimeString()}.`);
        } else {
          sessionStorage.removeItem('rateLimitInfo');
        }
      }
    };
    checkStoredRateLimit();
  }, []);

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
    setRateLimitMessage('');
    setUrlError('');
    
    // Track URL entry as journey step
    if (e.target.value.trim() && !inputUrl.trim()) {
      Analytics.trackUserJourneyStep('url_entered');
      
      // Track time to first action (URL paste/type)
      const timeToAction = Math.round((Date.now() - pageLoadTime) / 1000);
      Analytics.trackTimeToFirstAction(timeToAction, 'url_paste');
    }
  };

  const handleAnalyzeClick = async () => {
    // Track journey step and time to analyze click
    Analytics.trackUserJourneyStep('analysis_started');
    const timeToAction = Math.round((Date.now() - pageLoadTime) / 1000);
    Analytics.trackTimeToFirstAction(timeToAction, 'analyze_click');
    
    // Track video analysis attempt
    Analytics.trackVideoAnalysisAttempted('user_input');

    if (!inputUrl.trim()) return;
    setRateLimitMessage('');
    setUrlError('');

    try {
      validateUrl(inputUrl);
    } catch (error) {
      setUrlError("Please enter a valid YouTube URL");
      return;
    }

    const storedInfo = sessionStorage.getItem('rateLimitInfo');
    if (storedInfo) {
      const info = JSON.parse(storedInfo);
      if (info.isLimited && new Date(info.resetTime) > new Date()) {
        const resetDate = new Date(info.resetTime);
        setRateLimitMessage(`Rate limit reached. Please try again after ${resetDate.toLocaleTimeString()}.`);
        return;
      } else {
        sessionStorage.removeItem('rateLimitInfo');
      }
    }

    setIsAnalyzing(true);
    setVideoUrl(inputUrl);

    navigate("/analysis");
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

  // const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <div className="home">
      <div className="home-header-container">
        <div className="home-header">
          {/* <h1 className="home-header-title1">Video Claim</h1>
          <h1 className="home-header-title2">Catcher</h1>
          <p>Transform Watching into Knowing</p> */}
          <img 
            src="/video claim logo.svg" 
            alt="Video Claim Catcher - Transform Watching into Knowing"
            className="home-header-logo"
          />
        </div>        
      </div>

      <div className="input-container">
        <div className="input-container-text">
          Instantly break down any YouTube video into detailed topics, fact-checkable claims, and actionable insights you can explore and verify
        </div>
        <div className="input-button-wrapper">
          <input
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder="Enter YouTube video link here ..."
            className="main-input dark"
            disabled={isAnalyzing}
          />
          <button 
            onClick={handleAnalyzeClick}
            className={`analyze-button-inline dark ${isAnalyzing || rateLimitMessage || urlError ? 'disabled' : ''}`}
            disabled={isAnalyzing || !apiStatus.success || !!rateLimitMessage || !!urlError}
          >
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </div>  
        <div className="url-format-helper">
          <span>youtube.com/watch?v=VIDEO_ID</span>
          <span>youtu.be/VIDEO_ID</span>
        </div>
        {urlError && (
          <div className="url-error-message">
            {urlError}
          </div>
        )}
      </div>
      {rateLimitMessage && (
        <div className="rate-limit-message error-message"> 
          {rateLimitMessage}
        </div>
      )}
      <Slideshow />
    </div>
  );
}

export default Home; 
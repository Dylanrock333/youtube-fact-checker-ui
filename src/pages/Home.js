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
          <h1 className="home-header-title1">VEROFYI</h1>
          <p className="home-header-title2">Know What You Watch</p>
          <div className="home-header-title3">
          Explore Topics, Verify Claims, and Gain Insights From Any YouTube Video Instantly
        </div>
        </div>        
      </div>

      <div className="input-container">
        <div className="input-button-wrapper">
          <input
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder="Enter YouTube video link here ..."
            className="main-input"
            disabled={isAnalyzing}
          />
          <button 
            onClick={handleAnalyzeClick}
            className={`analyze-button-inline ${isAnalyzing || rateLimitMessage || urlError ? 'disabled' : ''}`}
            disabled={isAnalyzing || !apiStatus.success || !!rateLimitMessage || !!urlError}
          >
            {isAnalyzing ? '⚡Analyzing...' : '⚡Analyze'}
          </button>
        </div>  
        <div className="url-format-helper">
          <span>youtube.com/watch?v=ID</span>
          <span>youtu.be/ID</span>
        </div>

        <div className="demo-video-container-wrapper">
          <div className="demo-video-container">
            <div className="demo-video-content">
              <h3 className="demo-video-header">⚡Video Analysis</h3>
              <div className="demo-video-container-text">
                Get the most accurate insights by simply copying any YouTube video link and pasting it to Verofyi. Receive in-depth analysis in seconds with a clean, organized format that breaks down claims, facts, and key takeaways.
              </div>
            </div>
            <div className="demo-video-element">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="demo-video"
              >
                <source src="/verofyi - video analysis.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="demo-video-container">
            <div className="demo-video-element">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="demo-video-deepsearch"
              >
                <source src="/verofyi - deepsearch.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="demo-video-content">
              <h3 className="demo-video-header">🔎Deep Search</h3>
              <div className="demo-video-container-text">
                Dive deeper with DeepSearch to investigate specific claims from any video. Get comprehensive fact-checking with verified sources, expert analysis, and detailed context to understand the complete story behind every statement.
              </div>
            </div>
          </div>
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
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { checkApiHealth} from '../api/api';
import { useNavigate } from 'react-router-dom';
import validateUrl from '../utils/urlDecoder';
import '../styles/Home.css';
import { useTranslation } from '../translation/useTranslation';
import Slideshow from '../components/items/slideshow';

/* global gtag */

//TODO: add the video duration
function Home() {
  const { t } = useTranslation();
  const [inputUrl, setInputUrl] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAnalyzing, setIsAnalyzing, setVideoUrl } = useAnalysis();
  const [apiStatus, setApiStatus] = useState({ loading: true, success: null });
  const [rateLimitMessage, setRateLimitMessage] = useState('');

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
  };

  const handleAnalyzeClick = async () => {
    // Track analytics event
    if (window.gtag) {
      window.gtag('event', 'analyze_button_clicked', {
        event_category: 'engagement',
        event_label: 'Analyze button clicked',
        value: 1
      });
    }

    if (!inputUrl.trim()) return;
    setRateLimitMessage('');

    try {
      validateUrl(inputUrl);
    } catch (error) {
      setRateLimitMessage("Invalid URL format.");
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
        <span className="loading">{t('common.loading')}</span>
      ) : apiStatus.success ? (
        <span className="success">{t('common.success')}</span>
      ) : (
        <span className="error">{t('common.error')}</span>
      )}
    </div>
  ) : null; 
  
  return (
    <div className="home">
      <div className="home-header-container">
        <div className="home-header">
          <h1 className="home-header-title1">{t('home.title1')}</h1>
          <h1 className="home-header-title2">{t('home.title2')}</h1>
          <p>{t('home.subtitle')}</p>
        </div>        
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputUrl}
          onChange={handleInputChange}
          placeholder={t('home.inputPlaceholder')}
          className={`main-input ${theme}`}
          disabled={isAnalyzing}
        />
      </div>
      {rateLimitMessage && (
        <div className="rate-limit-message error-message"> 
          {rateLimitMessage}
        </div>
      )}
      <div className="button-container">
        <button 
          onClick={handleAnalyzeClick}
          className={`analyze-button ${theme} ${isAnalyzing || rateLimitMessage ? 'disabled' : ''}`}
          disabled={isAnalyzing || !apiStatus.success || !!rateLimitMessage}
        >
          {isAnalyzing ? t('home.analyzingButton') : t('home.analyzeButton')}
        </button>
      </div>  
      <Slideshow />
    </div>
  );
}

export default Home; 
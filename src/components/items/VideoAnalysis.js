import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoAnalysis.css';
import YouTubeVideo from './YouTubeVideo';
import { useAnalysis } from '../../context/AnalysisContext';
import { useTheme } from '../../context/ThemeContext'; 
import { useTranslation } from '../../translation/useTranslation';
import Analytics from '../../utils/analytics';

//TODO: when the pai can handle more plarforms change how YouTubeVideo componenet is handled

const VideoAnalysis = ({ analysisData}) => {
  const { videoUrl } = useAnalysis();
  const [expandedClaims, setExpandedClaims] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // Track when results are viewed (journey step) - must be at top level
  useEffect(() => {
    if (analysisData && analysisData.claims) {
      Analytics.trackUserJourneyStep('results_viewed', analysisData.videoID);
    }
  }, [analysisData]);
  
  // Add more thorough checks for analysisData
  if (!analysisData || !analysisData.claims) {
    return (
      <div className={`video-analysis ${theme}`}>
        <div className="video-info">
          <h2>Video Analysis Results</h2>
          {isLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="placeholder-video">
              Waiting for analysis...
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleToggleClaim = (claimId) => {
    setExpandedClaims(prev => ({
      ...prev,
      [claimId]: !prev[claimId]
    }));
  };

  // Function to navigate to deep search page
  const handleStartDeepSearch = (claimId) => {
    const claim = analysisData.claims.find(c => c.id === claimId);
    
    // Track journey step and deep search
    Analytics.trackUserJourneyStep('claim_explored', analysisData?.videoID);
    Analytics.trackDeepSearchPerformed(claim?.context || 'unknown', analysisData?.videoID);
    
    setIsLoading(true);
    const query = claim.search_query;
    const videodata = analysisData.video_data;

    // Clear existing data for this claim from localStorage
    //TODO: if the claimId is the same as the one in localStorage, don't clear it
    localStorage.removeItem(`search-${claimId}`);

    navigate('/deep-search', { 
      state: { 
        query, 
        claimId, 
        claimTitle: claim.title,
        claimText: claim.claim,
        context: claim.context,
        timestamp: claim.timestamp,
        videodata: videodata
      } 
    });
  };

  const isDev = process.env.NODE_ENV === 'development';
  const videoIdDisplay = isDev ? (
    <div className="video-id">Video ID: {analysisData.videoID}</div>
  ) : null; 

  return (
    <div className={`video-analysis ${theme}`}>
      {/* Video Information Section */}
      <div className="video-info">
        <div className={`video-title-container ${theme}`}>
          <h2>{analysisData.video_data.title || 'Video Analysis Results'}</h2>
        </div>
        
        {isLoading ? (
          <div className="loading-spinner">{t('common.loading')}</div>
        ) : (
          <YouTubeVideo url={videoUrl} />
        )}
        
        <div className="video-metadata">
          <div className="metadata-item">
            <span className="metadata-label">{t('analysis.channel')}</span>
            <span className="metadata-value">{analysisData.video_data.channel_title}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">{t('analysis.views')}</span> 
            <span className="metadata-value">
              {analysisData.video_data.view_count}
            </span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">{t('analysis.published')}</span>
            <span className="metadata-value">
              {analysisData.video_data.published_at.split('T')[0]}
            </span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">{t('analysis.duration')}</span>
            <span className="metadata-value">{analysisData.video_data.duration}</span>
          </div>
        </div>
        {videoIdDisplay}
      </div>
      {/* Claims Section */}
      <div className="claim-count">{t('analysis.totalClaims')}: {analysisData.claim_count}</div>
      <div className="claims-grid">
        {isLoading ? (
          <div className="loading-spinner">{t('common.loading')}</div>
        ) : (
          analysisData.claims.map((claim) => (
            <div key={claim.id} className={`claim-card ${theme}`}>
              <div className="claim-header">
                <span className="timestamp">{t('analysis.timestamp')}: {claim.timestamp}</span>
                <span className="category">{claim.category}</span>
              </div>

              <div className="claim-title-container">
                <p className="claim-title">{claim.title}</p>
              </div>
              
              <div className="claim-text-container">
                <p className="claim-text">
                  {claim.claim.length > 280 && !expandedClaims[claim.id] ? (
                    <>
                      {`${claim.claim.substring(0, 280)}...`}
                      <button
                        className="show-more-less-button"
                        onClick={() => handleToggleClaim(claim.id)}
                      >
                        {t('analysis.showMore')}
                      </button>
                    </>
                  ) : (
                    <>
                      {claim.claim}
                      {claim.claim.length > 300 && (
                        <>
                          {' '}
                          <button
                            className="show-more-less-button"
                            onClick={() => handleToggleClaim(claim.id)}
                          >
                            {t('analysis.showLess')}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              <div className="claim-context">          
                <div className="claim-tabs">
                  {t('analysis.context')}
                </div>
                
                <div className="tab-content">
                    <div className="context-content">
                      <p>{claim.context}</p>
                    </div>
                    <div className="deep-search-panel">
                      <button 
                        className="start-search-button"
                        onClick={() => handleStartDeepSearch(claim.id)} 
                      >
                        {t('analysis.startDeepSearch')}
                      </button>
                    </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis; 
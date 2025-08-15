import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoAnalysis.css';
import YouTubeVideo from './YouTubeVideo';
import ClaimCard from './ClaimCard';
import { useAnalysis } from '../../context/AnalysisContext';
import Analytics from '../../utils/analytics';

//TODO: when the pai can handle more plarforms change how YouTubeVideo componenet is handled

const VideoAnalysis = ({ analysisData}) => {
  const { videoUrl } = useAnalysis();
  // const [expandedClaims, setExpandedClaims] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Track when results are viewed (journey step) - must be at top level
  useEffect(() => {
    if (analysisData && analysisData.claims) {
      Analytics.trackUserJourneyStep('results_viewed', analysisData.videoID);
    }
  }, [analysisData]);
  
  // Add more thorough checks for analysisData
  if (!analysisData || !analysisData.claims) {
    return (
      <div className={`video-analysis dark`}>
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

  // handleToggleClaim moved to ClaimCard component
  /*
  const handleToggleClaim = (claimId) => {
    setExpandedClaims(prev => ({
      ...prev,
      [claimId]: !prev[claimId]
    }));
  };
  */

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
    <div className={`video-analysis dark`}>
      {/* Video Information Section */}
      <div className="video-info">
        <div className={`video-title-container dark`}>
          <h2>{analysisData.video_data.title || 'Video Analysis Results'}</h2>
        </div>
        
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <YouTubeVideo url={videoUrl} />
        )}
        
        <div className="video-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Channel</span>
            <span className="metadata-value">{analysisData.video_data.channel_title}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Views</span> 
            <span className="metadata-value">
              {analysisData.video_data.view_count}
            </span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Published</span>
            <span className="metadata-value">
              {analysisData.video_data.published_at.split('T')[0]}
            </span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Duration</span>
            <span className="metadata-value">{analysisData.video_data.duration}</span>
          </div>
        </div>
        {videoIdDisplay}
      </div>
      
      <hr className="divider" />
      
      {/* Claims Section */}
      <div className="claim-count">Total Claims: {analysisData.claim_count}</div>
      <div className="claims-grid">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          analysisData.claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onStartDeepSearch={handleStartDeepSearch}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis; 
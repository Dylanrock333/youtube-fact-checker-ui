import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoAnalysis.css';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';
import YouTubeVideo from './YouTubeVideo';
import { useAnalysis } from '../../context/AnalysisContext';
import { useTheme } from '../../context/ThemeContext'; 

//TODO: when the pai can handle more plarforms change how YouTubeVideo componenet is handled

const VideoAnalysis = ({ analysisData}) => {
  const { videoUrl } = useAnalysis();
  const [activeTabs, setActiveTabs] = useState({});
  const [searchQueries, setSearchQueries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Function to adjust textarea height based on content
  const adjustTextareaHeight = useCallback((textarea) => {
    if (textarea) {
      textarea.style.height = 'auto'; // Temporarily shrink to calculate correct scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to content height
      textarea.style.overflow = 'hidden'; // Hide scrollbar after resizing
    }
  }, []);

  // Adjust height when 'deepSearch' tab becomes active
  useEffect(() => {
    Object.keys(activeTabs).forEach(claimId => {
      if (activeTabs[claimId] === 'deepSearch') {
        // Use setTimeout to ensure the element is rendered and measurable
        setTimeout(() => {
          const textarea = document.getElementById(`search-query-${claimId}`);
          adjustTextareaHeight(textarea);
        }, 0);
      }
    });
    // Add analysisData as a dependency in case initial data has deepSearch active
  }, [activeTabs, analysisData, adjustTextareaHeight]);

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

  // Function to handle tab switching
  const handleTabChange = (claimId, tabName) => {
    setActiveTabs(prev => ({
      ...prev,
      [claimId]: tabName
    }));
    
    // Initialize search query from claim when first switching to deep search
    if (tabName === 'deepSearch' && !searchQueries[claimId]) {
      const claim = analysisData.claims.find(c => c.id === claimId);
      setSearchQueries(prev => ({
        ...prev,
        [claimId]: claim.search_query
      }));
    }
  };

  // Function to handle search query changes
  const handleSearchQueryChange = (claimId, value, event) => {
    setSearchQueries(prev => ({
      ...prev,
      [claimId]: value
    }));
    // Adjust height dynamically as user types
    if (event && event.target) {
       adjustTextareaHeight(event.target);
    }
  };

  // Function to navigate to deep search page
  const handleStartDeepSearch = (claimId) => {
    setIsLoading(true);
    const query = searchQueries[claimId];
    const claim = analysisData.claims.find(c => c.id === claimId);
    const videodata = analysisData.video_data;

    // Clear existing data for this claim from localStorage
    //TODO: if the claimId is the same as the one in localStorage, don't clear it
    localStorage.removeItem(`search-${claimId}`);

    navigate('/deep-search', { 
      state: { 
        query, 
        claimId, 
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
          <div className="loading-spinner">Loading...</div>
        ) : (
          <YouTubeVideo url={videoUrl} />
        )}
        
        <div className="video-metadata">
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
            <span className="metadata-label">Channel</span>
            <span className="metadata-value">{analysisData.video_data.channel_title}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Duration</span>
            <span className="metadata-value">{analysisData.video_data.duration}</span>
          </div>
        </div>
        {videoIdDisplay}
      </div>
      {/* Claims Section */}
      <div className="claim-count">Total Claims Analyzed: {analysisData.claim_count}</div>
      <div className="claims-grid">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          analysisData.claims.map((claim) => (
            <div key={claim.id} className={`claim-card ${theme}`}>
              <div className="claim-header">
                <span className="timestamp">Timestamp: {claim.timestamp}</span>
                <span className="category">{claim.category}</span>
              </div>

              <div className="claim-title-container">
                <p className="claim-title">{claim.title}</p>
              </div>
              
              <div className="claim-text-container">
                <p className="claim-text">{claim.claim}</p>
              </div>
              
              <div className={`claim-context ${activeTabs[claim.id] === 'deepSearch' ? 'expanded' : ''}`}>          
                <div className="claim-tabs-container">
                  <div className="claim-tabs">
                    <button 
                      className={`tab-button ${activeTabs[claim.id] === 'context' || !activeTabs[claim.id] ? 'active' : ''}`}
                      onClick={() => handleTabChange(claim.id, 'context')}
                    >
                      Context
                    </button>
                    <button 
                      className={`tab-button ${activeTabs[claim.id] === 'metrics' ? 'active' : ''}`}
                      onClick={() => handleTabChange(claim.id, 'metrics')}
                    >
                      Claim Metrics
                    </button>
                    <button 
                      className={`tab-button ${activeTabs[claim.id] === 'deepSearch' ? 'active' : ''}`}
                      onClick={() => handleTabChange(claim.id, 'deepSearch')}
                    >
                      <FaSearch className="tab-icon" /> Deep Search
                    </button>
                  </div>
                  
                  <div className="tab-content">
                    {activeTabs[claim.id] === 'context' || !activeTabs[claim.id] ? (
                      <div className="context-content">
                        <p>{claim.context}</p>
                      </div>
                    ) : activeTabs[claim.id] === 'metrics' ? (
                      <div className="claim-details">
                        <div className="score-container">
                          <span className="score-label">
                            <FaInfoCircle 
                              className="info-icon" 
                              title="How much this claim differs from widely accepted information"
                            />                  
                            Controversy Level:
                          </span>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ width: `${(claim.controversy_score / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="score-container">
                          <span className="score-label">
                            <FaInfoCircle 
                              className="info-icon" 
                              title="How important this claim is to the video's main message"
                            />                  
                            Video Relevance:
                          </span>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ width: `${(claim.verification_importance / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="score-container">
                          <span className="score-label">
                            <FaInfoCircle 
                              className="info-icon" 
                              title="How easily this claim can be fact-checked with evidence"
                            />                    
                            Checkability:
                          </span>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ width: `${(claim.factual_precision / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="deep-search-panel">
                        <div className="search-query-container expanded">
                          <label htmlFor={`search-query-${claim.id}`}>Edit, Search and Explore...</label>
                          <textarea
                            id={`search-query-${claim.id}`}
                            className="search-query-input"
                            value={searchQueries[claim.id] || ''}
                            onChange={(e) => handleSearchQueryChange(claim.id, e.target.value, e)}
                            rows={3}
                            placeholder="Enter your search query..."
                            style={{ overflow: 'hidden' }}
                          />
                          <button 
                            className="start-search-button"
                            onClick={() => handleStartDeepSearch(claim.id)}
                          >
                            Start Deep Search
                          </button>
                        </div>
                      </div>
                    )}
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
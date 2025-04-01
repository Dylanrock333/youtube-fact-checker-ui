import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoAnalysis.css';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';
import YouTubeVideo from './YouTubeVideo';
import { useAnalysis } from '../../context/AnalysisContext';
import { useTheme } from '../../context/ThemeContext';

const VideoAnalysis = ({ analysisData }) => {
  const { videoUrl } = useAnalysis();
  const [activeTabs, setActiveTabs] = useState({});
  const [searchQueries, setSearchQueries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

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
  const handleSearchQueryChange = (claimId, value) => {
    setSearchQueries(prev => ({
      ...prev,
      [claimId]: value
    }));
  };

  // Function to navigate to deep search page
  const handleStartDeepSearch = (claimId) => {
    setIsLoading(true);
    const query = searchQueries[claimId];
    const claim = analysisData.claims.find(c => c.id === claimId);
    const videodata = analysisData.video_data;

    // Clear existing data for this claim from localStorage
    localStorage.removeItem(`search-${claimId}`);
    console.log(`removed item id: search-${claimId}`);

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

  return (
    <div className={`video-analysis ${theme}`}>
      {/* Video Information Section */}
      <div className="video-info">
        <h2>{analysisData.video_data.title || 'Video Analysis Results'}</h2>
        <div className="claim-count">Total Claims Analyzed: {analysisData.claim_count}</div>
        
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <YouTubeVideo url={videoUrl} />
        )}
        
        <div className="video-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Views</span>
            <span className="metadata-value">
              {Number(analysisData.video_data.view_count).toLocaleString()}
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
        </div>
        
        <div className="video-id">Video ID: {analysisData.video_id}</div>
      </div>
      {/* Claims Section */}
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
              
              <p className="claim-text">{claim.claim}</p>
              
              <div className={`claim-context ${activeTabs[claim.id] === 'deepSearch' ? 'expanded' : ''}`}>
                {/* Context is only visible when not in deep search mode */}
                <div className="context-content">
                  <p><strong>Context:</strong> {claim.context}</p>
                </div>
                
                <div className="claim-tabs-container">
                  <div className="claim-tabs">
                    <button 
                      className={`tab-button ${activeTabs[claim.id] !== 'deepSearch' ? 'active' : ''}`}
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
                    {activeTabs[claim.id] !== 'deepSearch' ? (
                      <div className="claim-details">
                        <div className="score-container">
                          <span className="score-label">
                            <FaInfoCircle 
                              className="info-icon" 
                              title="How much this claim contradicts established consensus or presents information in a potentially misleading way"
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
                              title="How important this claim is to the overall message and how much it might influence viewers' understanding of the topic"
                            />                  
                            Search Priority:
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
                              title="How detailed and precisely verifiable the claim is, with higher scores indicating claims that can be clearly checked against evidence"
                            />                    
                            Claim Specificity:
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
                          <label htmlFor={`search-query-${claim.id}`}>Search Query:</label>
                          <textarea
                            id={`search-query-${claim.id}`}
                            className="search-query-input"
                            value={searchQueries[claim.id] || ''}
                            onChange={(e) => handleSearchQueryChange(claim.id, e.target.value)}
                            rows={5}
                            placeholder="Enter your search query..."
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoAnalysis.css';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';

const VideoAnalysis = ({ analysisData, isDarkMode }) => {
  // Move all useState hooks to the top level, before any conditional logic
  const [activeTabs, setActiveTabs] = useState({});
  const [searchQueries, setSearchQueries] = useState({});
  const navigate = useNavigate();

  // Early return after hooks are defined
  if (!analysisData) return null;

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
    const query = searchQueries[claimId];
    const claim = analysisData.claims.find(c => c.id === claimId);
    navigate('/deep-search', { 
      state: { 
        query, 
        claimId, 
        claimText: claim.claim,
        isDarkMode 
      } 
    });
  };

  return (
    <div className={`video-analysis ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Video Information Section */}
      <div className="video-info">
        <h2>{analysisData.video_title || 'Video Analysis Results'}</h2>
        <p className="claim-count">Total Claims Analyzed: {analysisData.claim_count}</p>
        <p className="video-id">Video ID: {analysisData.video_id}</p>
      </div>

      {/* Claims Section */}
      <div className="claims-grid">
        {analysisData.claims.map((claim) => (
          <div key={claim.id} className={`claim-card ${isDarkMode ? 'dark' : 'light'}`}>
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
                    <FaSearch className="tab-icon" /> Deep Verification
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
                          Verification Priority:
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
        ))}
      </div>
    </div>
  );
};

export default VideoAnalysis; 
import React, { useState } from 'react';
import './VideoAnalysis.css';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';

const VideoAnalysis = ({ analysisData, isDarkMode }) => {
  // Move all useState hooks to the top level, before any conditional logic
  const [activeTabs, setActiveTabs] = useState({});
  const [deepSearchResults, setDeepSearchResults] = useState({});
  const [deepSearchLoading, setDeepSearchLoading] = useState({});

  // Early return after hooks are defined
  if (!analysisData) return null;

  // Function to handle tab switching
  const handleTabChange = (claimId, tabName) => {
    setActiveTabs(prev => ({
      ...prev,
      [claimId]: tabName
    }));

    // If switching to deep search tab and no results exist yet, trigger the search
    if (tabName === 'deepSearch' && !deepSearchResults[claimId]) {
      handleDeepSearch(claimId, analysisData.claims.find(c => c.id === claimId).search_query);
    }
  };

  // Function to handle deep search
  const handleDeepSearch = async (claimId, searchQuery) => {
    // Set loading state for this specific claim
    setDeepSearchLoading(prev => ({
      ...prev,
      [claimId]: true
    }));

    try {
      // This is where you would call your Perplexity API
      // For now, we'll simulate a delay and return a mock result
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - replace with actual API call
      const result = `Based on a comprehensive search, this claim appears to be ${Math.random() > 0.5 ? 'supported' : 'contradicted'} by multiple sources. The search query "${searchQuery}" returned information from reliable sources that ${Math.random() > 0.5 ? 'confirms' : 'challenges'} the key assertions made in this claim.`;
      
      // Store the result
      setDeepSearchResults(prev => ({
        ...prev,
        [claimId]: result
      }));
    } catch (error) {
      // Handle error
      setDeepSearchResults(prev => ({
        ...prev,
        [claimId]: `Error performing deep search: ${error.message}`
      }));
    } finally {
      // Clear loading state
      setDeepSearchLoading(prev => ({
        ...prev,
        [claimId]: false
      }));
    }
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
            
            <div className="claim-context">
              <p><strong>Context:</strong> {claim.context}</p>
              
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
                    {deepSearchLoading[claim.id] ? (
                      <div className="deep-search-loading">
                        <div className="deep-search-spinner"></div>
                        <p>Performing deep verification...</p>
                      </div>
                    ) : deepSearchResults[claim.id] ? (
                      <div className="deep-search-result">
                        <h4>Verification Results</h4>
                        <p>{deepSearchResults[claim.id]}</p>
                      </div>
                    ) : (
                      <div className="deep-search-placeholder">
                        <p>Click the Deep Verification tab to verify this claim using Perplexity AI.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoAnalysis; 
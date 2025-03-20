import React from 'react';
import './VideoAnalysis.css';

const VideoAnalysis = ({ analysisData, isDarkMode }) => {
  if (!analysisData) return null;

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
              <p><strong>Search Query:</strong> {claim.internet_search_query}</p>
              
              <div className="claim-details">
                <div className="score-container">
                  <span className="score-label">Controversy Score:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${(claim.controversy_score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="score-container">
                  <span className="score-label">Search Score:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${(claim.internet_searchability / 5) * 100}%` }}
                    ></div>
                  </div>
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
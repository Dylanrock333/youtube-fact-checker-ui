import React, { useState } from 'react';
import './ClaimCard.css';

const ClaimCard = ({ 
  claim, 
  onStartDeepSearch 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleClaim = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div key={claim.id} className={`claim-card`}>
      <div className="claim-header">
        <span className="timestamp">
          <span className="timestamp-emoji">⏱️</span>
          {claim.timestamp}
        </span>
        <span className="category">{claim.category}</span>
      </div>

      <div className="claim-title-container">
        <p className="claim-title">{claim.title}</p>
      </div>
      
      <div className="claim-text-container">
        <p className="claim-text">
          {claim.claim.length > 280 && !isExpanded ? (
            <>
              {`${claim.claim.substring(0, 280)}...`}
              <button
                className="show-more-less-button"
                onClick={handleToggleClaim}
              >
                Show more
              </button>
            </>
          ) : (
            <>
              {claim.claim}
              {claim.claim.length > 280 && (
                <>
                  {' '}
                  <button
                    className="show-more-less-button"
                    onClick={handleToggleClaim}
                  >
                    Show less
                  </button>
                </>
              )}
            </>
          )}
        </p>
      </div>
      
      <div className="claim-context">          
        <div className="context-container">
          Context
        </div>
        
        <div className="tab-content">
            <div className="context-content">
              <p>{claim.context}</p>
            </div>
            <div className="deep-search-panel">
              <button 
                className="start-search-button"
                onClick={() => onStartDeepSearch(claim.id)} 
              >
                🔎 Deep Search
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;
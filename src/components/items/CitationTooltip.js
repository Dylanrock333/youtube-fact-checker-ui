import React, { useState } from 'react';
import './CitationTooltip.css';

const CitationTooltip = ({ url, number, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <span
        className="citation-link"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: url ? 'pointer' : 'default' }}
      >
        {number}
      </span>
      
      {isVisible && url && (
        <div
          className="citation-tooltip"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div className="citation-tooltip-arrow"></div>
          <div className="citation-tooltip-content">
            {url}
          </div>
        </div>
      )}
    </>
  );
};

export default CitationTooltip;
import React, { useEffect, useRef, useState } from 'react';
import "./hexagon-loading.css";   

const HexagonLoader = ({ 
  className = "loading-hexagon", 
  color = "#20A9BC",
  isVisible = true 
}) => {
  const svgRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(isVisible);

  // Control animation based on visibility
  useEffect(() => {
    setShouldAnimate(isVisible);
  }, [isVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setShouldAnimate(false);
    };
  }, []);

  // Don't render if not visible (saves most memory)
  if (!isVisible) {
    return null;
  }

  return (
    <svg 
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100"
      className={`${className} ${shouldAnimate ? 'animate' : 'paused'}`}
      aria-label="Loading animation"
      role="img"
    >
      <polygon
        className="outer-hexagon"
        points="50,10 85,30 85,70 50,90 15,70 15,30"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      <polygon
        className="inner-hexagon"
        points="50,25 72.5,37.5 72.5,62.5 50,75 27.5,62.5 27.5,37.5"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default HexagonLoader;
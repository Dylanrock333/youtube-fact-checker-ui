import React from 'react';
import YouTube from 'react-youtube';
import './YouTubeVideo.css';
const YouTubeVideo = ({ url, timestamp, shouldAutoplay = false }) => {
  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Convert timestamp string (e.g. "1:30") to seconds
  const convertTimestampToSeconds = (timestamp) => {
    if (!timestamp) return 0;
    
    // Handle different timestamp formats
    const parts = timestamp.split(':').map(part => parseInt(part, 10));
    
    if (parts.length === 3) {
      // Format: HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // Format: MM:SS
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // Format: SS
      return parts[0];
    }
    
    return 0;
  };

  const videoId = getVideoId(url);
  const startSeconds = convertTimestampToSeconds(timestamp);
  
  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Determine autoplay based on user action and device
  const autoplayValue = shouldAutoplay ? (isMobile ? 0 : 1) : 0;
  
  // Options for the YouTube player
  const opts = {
    playerVars: {
      autoplay: autoplayValue, // Only autoplay when user clicks timestamp (and on desktop)
      start: startSeconds, // This will make the video start at the specified timestamp
      rel: 0, // Don't show related videos
      modestbranding: 1, // Use modest branding
      origin: window.location.origin,
    },
  };

  if (!videoId) {
    return <div className="youtube-error">Invalid YouTube URL</div>;
  }

  return (
    <div className="youtube-container">
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        className="youtube-video"
      />
    </div>
  );
};

export default YouTubeVideo; 
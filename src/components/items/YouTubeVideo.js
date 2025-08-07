import React from 'react';
import YouTube from 'react-youtube';
import './YouTubeVideo.css';
import Analytics from '../../utils/analytics';

const YouTubeVideo = ({ url, timestamp }) => {
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
  
  // YouTube player event handlers
  const onReady = (event) => {
    Analytics.trackVideoInteraction('ready', videoId, startSeconds);
  };

  const onPlay = (event) => {
    const currentTime = Math.floor(event.target.getCurrentTime());
    Analytics.trackVideoInteraction('play', videoId, currentTime);
  };

  const onPause = (event) => {
    const currentTime = Math.floor(event.target.getCurrentTime());
    Analytics.trackVideoInteraction('pause', videoId, currentTime);
  };

  const onEnd = (event) => {
    Analytics.trackVideoInteraction('ended', videoId);
  };
  
  // Options for the YouTube player
  const opts = {
    playerVars: {
      autoplay: 0,
      start: startSeconds, // This will make the video start at the specified timestamp
      origin: window.location.origin, // Add this line
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
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
      />
    </div>
  );
};

export default YouTubeVideo; 
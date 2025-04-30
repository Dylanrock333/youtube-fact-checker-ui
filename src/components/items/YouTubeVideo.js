import React from 'react';
import YouTube from 'react-youtube';
import './YouTubeVideo.css';

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
  
  // Options for the YouTube player
  const opts = {
    playerVars: {
      autoplay: 0,
      start: startSeconds, // This will make the video start at the specified timestamp
    },
  };

  if (!videoId) {
    return <div className="youtube-error">Invalid YouTube URL</div>;
  }

  return (
    <div className="youtube-video-container">
      <YouTube 
        videoId={videoId} 
        opts={opts} 
        className="youtube-video"
      />
    </div>
  );
};

export default YouTubeVideo; 
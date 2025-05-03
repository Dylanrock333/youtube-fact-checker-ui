import React from 'react';
import YouTube from 'react-youtube';
import './YouTubeVideo.css';

// Accept url, timestamp, and videoId as props
const YouTubeVideo = ({ url, timestamp, videoId: videoIdProp }) => {

  // Restore the getVideoId function
  const getVideoId = (url) => {
    // Ensure url is a string before matching
    if (typeof url !== 'string') return null;
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

  // Determine the videoId: use videoIdProp if provided, otherwise extract from url
  const videoId = videoIdProp || (url ? getVideoId(url) : null);
  let startSeconds = 0;
  if (timestamp != null) {
    startSeconds = convertTimestampToSeconds(timestamp);
  }
  
  // Options for the YouTube player
  const opts = {
    playerVars: {
      autoplay: 0,
      start: startSeconds, // This will make the video start at the specified timestamp
    },
  };

  // Check if we successfully determined a videoId
  if (!videoId) {
    // Provide a more informative error message
    return <div className="youtube-error">Invalid YouTube URL or Video ID</div>;
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
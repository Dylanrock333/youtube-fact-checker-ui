import React from 'react';
import YouTube from 'react-youtube';
import './YouTubeVideo.css';

const YouTubeVideo = ({ url }) => {
  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);
  
  // Options for the YouTube player
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
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
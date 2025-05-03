import React, { useState, useEffect } from 'react';
import YouTubeVideo from './YouTubeVideo';
import { getBrowserVideos } from '../../api/api';
import './videoBrowser.css';

// Fisher-Yates (Knuth) Shuffle function
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const VideoBrowser = () => {
    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await getBrowserVideos('test');
                // Shuffle the array before setting state
                // Create a copy using spread syntax [...] to avoid mutating the original array if needed elsewhere
                const shuffledVideos = shuffleArray([...response]);
                setVideos(shuffledVideos);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, []);
    
    return (
        <div>
            <div>
                Start seatching and select a video, or enter a link...
            </div>
            {videos.length > 0 && (
                <div className="video-browser">
                {videos.slice(0, 8).map((video) => (
                    <div key={video.video_id} className="video-item"> 
                        <img 
                            src={`http://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`} 
                            alt={video.title} 
                            className="video-thumbnail" 
                        />
                        <h1 className="video-title">{video.title}</h1> 
                    </div>
                ))}
            </div>            
            )}
        </div>
    )   
}   


export default VideoBrowser;


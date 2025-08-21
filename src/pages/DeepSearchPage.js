import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/DeepSearchPage.css';
import { performDeepSearch } from '../api/api';
import { useAnalysis } from '../context/AnalysisContext';
import YouTubeVideo from '../components/items/YouTubeVideo';
import HexagonLoader from '../components/items/hexagon-loading';
// import { marked } from 'marked';
import ReactMarkdown from 'react-markdown';
import { processCitations } from '../utils/citationProcessor';

const DeepSearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { query, claimId, claimTitle, claimText, context, timestamp, videodata } = location.state || {};
    const { videoUrl, setDeepSearchResult } = useAnalysis();
    
    const [isLoading, setIsLoading] = useState(true);
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const [showCitations, setShowCitations] = useState(false);

    useEffect(() => {
        console.log('useEffect triggered');
        const performSearch = async () => {
            try {
                setIsLoading(true);

                let attempts = 0;
                const maxAttempts = 2; // Initial try + 2 retries

                while (attempts < maxAttempts) {
                    try {
                        console.log(`Attempt ${attempts + 1} of ${maxAttempts}`);
                        const result = await performDeepSearch(query, videodata, context, claimText);
                        
                        if (typeof result === 'string' && result.includes('Error')) {
                            throw new Error(result);
                        }
                        
                        // Store the result in localStorage
                        setDeepSearchResult(result);
                        console.log(`saved item id: search-${claimId}`);
                        
                        setSearchResult(result);
                        setError(null);
                        return; // Success! Exit the function
                    } catch (error) {
                        attempts++;
                        if (attempts === maxAttempts) {
                            console.error('Final attempt failed:', error);
                            setError(`Error performing deep search: ${error.message}`);
                            setSearchResult(null);
                        } else {
                            console.log(`Attempt ${attempts} failed, retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
                        }
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (query && (claimId === 0 || claimId)) {
            performSearch();
        } else {
            navigate('/');
        }
    }, [query, context, navigate, claimText, claimId, videodata, setDeepSearchResult]);

    const toggleCitations = () => {
        setShowCitations(!showCitations);
    };

    const handleTimestampClick = () => {
        if (videoUrl && timestamp) {
            // Scroll to video container
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Find the YouTube iframe and play at timestamp
                const iframe = videoContainer.querySelector('iframe');
                if (iframe) {
                    // Convert timestamp to seconds
                    const timeInSeconds = convertTimestampToSeconds(timestamp);
                    
                    // Extract video ID from URL
                    const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                    
                    if (videoId) {
                        // Update iframe src to play at specific timestamp
                        const newSrc = `https://www.youtube.com/embed/${videoId}?start=${timeInSeconds}&autoplay=1`;
                        iframe.src = newSrc;
                    }
                }
            }
        }
    };

    const convertTimestampToSeconds = (timestamp) => {
        // Handle formats like "1:23", "12:34", "1:23:45"
        const parts = timestamp.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1]; // MM:SS
        } else if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
        }
        return 0;
    };


    return (
        <div className="deep-search-page dark">

            <div className="claim-box">
                <div className="ds-claim-header">
                    {timestamp && (
                        <button 
                            className="timestamp-button" 
                            onClick={handleTimestampClick}
                            title="Click to open YouTube video at this timestamp"
                        >
                            ⏱️{timestamp}
                        </button>
                    )}
                </div>

                <div className="claim-title">
                    {claimTitle}
                </div>

                <hr className="divider" />   

                <div className="claim-text">
                    {claimText || 'No claim found'}
                </div>
                {videoUrl && (
                    <div className="video-container">
                        <YouTubeVideo url={videoUrl} timestamp={timestamp} />
                    </div>
                )}
                
                {context && (
                    <div className="context-section">
                        <h3>Context</h3>
                        <p className="context-text">{context}</p>
                    </div>
                )}
                <hr className="divider" /> 
                <div className="results-box">
                    {isLoading ? (
                        <div className="loading-container">
                            <HexagonLoader 
                                className="loading-hexagon" 
                                isVisible={isLoading}
                            />
                            <p>Performing Deep Search....</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            {error}
                        </div>
                    ) : (
                        <div className="result-content">
                            <div className="sonar-result">
                            <div className="sonar-content">
                                <div 
                                    dangerouslySetInnerHTML={{ 
                                        __html: processCitations(
                                            searchResult.choices[0].message.content, 
                                            searchResult.citations
                                        ) 
                                    }} 
                                />
                            </div>
                                
                                {searchResult.citations && searchResult.citations.length > 0 && (
                                    <div className="citations-section">
                                        <button 
                                            className="citations-toggle" 
                                            onClick={toggleCitations}
                                        >
                                            {showCitations ? (
                                                <> Hide Citations <FaChevronUp /></>
                                            ) : (
                                                <> Show Citations <FaChevronDown /></>
                                            )}
                                        </button>
                                        
                                        {showCitations && (
                                            <div className="citations-list">
                                                <ol>
                                                    {searchResult.citations.map((citation, index) => (
                                                        <li key={index}>
                                                            <a href={citation} target="_blank" rel="noopener noreferrer">
                                                                {citation}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeepSearchPage; 
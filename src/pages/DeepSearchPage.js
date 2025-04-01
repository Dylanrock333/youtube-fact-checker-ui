import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/DeepSearchPage.css';
import { useTheme } from '../context/ThemeContext';
import { performDeepSearch } from '../api/youtubeApi';
import { useAnalysis } from '../context/AnalysisContext';
import YouTubeVideo from '../components/items/YouTubeVideo';
import hexagonLoading from '../assets/hexagon-loading.svg';

const DeepSearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { query, claimId, claimText, context, timestamp, videodata } = location.state || {};
    const { theme } = useTheme();
    const { videoUrl } = useAnalysis();
    
    const [isLoading, setIsLoading] = useState(true);
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const [showCitations, setShowCitations] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            try {
                setIsLoading(true);

                // Check if data is already in localStorage
                const storedResult = localStorage.getItem(`search-${claimId}`);
                console.log(`storedResult: search-${claimId}`);
                if (storedResult) {
                    setSearchResult(JSON.parse(storedResult));
                    setError(null);
                    setIsLoading(false);
                    return;
                }

                const result = await performDeepSearch(query, videodata, context, claimText);
                
                if (typeof result === 'string' && result.includes('Error')) {
                    setError(result);
                    setSearchResult(null);
                } else {
                    // Store the result in localStorage
                    localStorage.setItem(`search-${claimId}`, JSON.stringify(result));

                    console.log(`saved item id: search-${claimId}`);
                    
                    setSearchResult(result);
                    setError(null);
                }
            } catch (error) {
                setError(`Error performing deep search: ${error.message}`);
                setSearchResult(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (query && (claimId === 0 || claimId)) {
            performSearch();
        } else {
            navigate('/');
        }
    }, [query, context, navigate, claimText, claimId, videodata]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleCitations = () => {
        setShowCitations(!showCitations);
    };

    return (
        <div className={`deep-search-page ${theme}`}>
            <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back to Analysis
            </button>
            <h2>Deep Search</h2>
            
            <div className="claim-box">
                <div className="claim-header">
                    {timestamp && <span className="timestamp">Timestamp: {timestamp}</span>}
                </div>
                <p>{claimText || 'No claim provided'}</p>
                {videoUrl && (
                    <div className="video-container">
                        <YouTubeVideo url={videoUrl} timestamp={timestamp} />
                    </div>
                )}
            </div>
            
            <div className="info-row">
                {context && (
                    <div className="context-box">
                        <h3>Context:</h3>
                        <p>{context}</p>
                    </div>
                )}
                
                <div className="query-box">
                    <h3>Search Query:</h3>
                    <p>{query || 'No query provided'}</p>
                </div>
            </div>
            
            <div className="results-box">
                <h3>Search Results:</h3>
                
                {isLoading ? (
                    <div className="loading-container">
                        <object type="image/svg+xml" data={hexagonLoading} className="loading-hexagon">
                            Loading animation
                        </object>
                        <p>Performing deep search...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : (
                    <div className="result-content">
                        <div className="sonar-result">
                            <div className="sonar-content">
                                {searchResult.choices[0].message.content}
                            </div>
                            
                            {searchResult.citations && searchResult.citations.length > 0 && (
                                <div className="citations-section">
                                    <button 
                                        className="citations-toggle" 
                                        onClick={toggleCitations}
                                    >
                                        {showCitations ? (
                                            <>Hide Citations <FaChevronUp /></>
                                        ) : (
                                            <>Show Citations <FaChevronDown /></>
                                        )}
                                    </button>
                                    
                                    {showCitations && (
                                        <div className="citations-list">
                                            <h4>Citations</h4>
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
    );
};

export default DeepSearchPage; 
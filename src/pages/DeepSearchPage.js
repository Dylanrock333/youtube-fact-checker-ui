import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/DeepSearchPage.css';
import { useTheme } from '../context/ThemeContext';
import { performDeepSearch } from '../api/api';
import { useAnalysis } from '../context/AnalysisContext';
import YouTubeVideo from '../components/items/YouTubeVideo';
import HexagonLoader from '../components/items/hexagon-loading';
import { marked } from 'marked';

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
    
    // Initialize state based on initial window width
    const [isContextExpanded, setIsContextExpanded] = useState(window.innerWidth > 768);
    const [isQueryExpanded, setIsQueryExpanded] = useState(window.innerWidth > 768);

    useEffect(() => {
        console.log('useEffect triggered');
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
                        localStorage.setItem(`search-${claimId}`, JSON.stringify(result));
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
    }, [query, context, navigate, claimText, claimId, videodata]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleCitations = () => {
        setShowCitations(!showCitations);
    };

    const toggleContext = () => {
        setIsContextExpanded(!isContextExpanded);
    };

    const toggleQuery = () => {
        setIsQueryExpanded(!isQueryExpanded);
    };
    
    const renderMarkdown = (content) => {
        return { __html: marked(content, { sanitize: true }) };
    };

    return (
        <div className={`deep-search-page ${theme}`}>
            <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back to Analysis
            </button>
            
            <div className="claim-box">
                <div className="claim-header">
                    {timestamp && <span className="timestamp">Timestamp: {timestamp}</span>}
                </div>
                <div className="claim-text">
                    {claimText || 'No claim provided'}
                </div>
                {videoUrl && (
                    <div className="video-container">
                        <YouTubeVideo url={videoUrl} timestamp={timestamp} />
                    </div>
                )}
            </div>
            
            <div className="info-row">
                {context && (
                    <div className={`context-box ${!isContextExpanded ? 'collapsed' : ''}`}>
                        <h3 onClick={toggleContext} className="collapsible-header">
                            Context:
                            <button className="toggle-icon">
                                {isContextExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                        </h3>
                        <p>{context}</p>
                    </div>
                )}
                
                <div className={`query-box ${!isQueryExpanded ? 'collapsed' : ''}`}>
                     <h3 onClick={toggleQuery} className="collapsible-header">
                        Searched for:
                        <button className="toggle-icon">
                            {isQueryExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </h3>
                    <p>{query || 'No query provided'}</p>
                </div>
            </div>
            
            <div className="results-box">
                
                {isLoading ? (
                    <div className="loading-container">
                        <HexagonLoader 
                            className="loading-hexagon" 
                            isVisible={isLoading}
                        />
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
                                <div dangerouslySetInnerHTML={renderMarkdown(searchResult.choices[0].message.content)} />
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
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/DeepSearchPage.css';
import { useTheme } from '../context/ThemeContext';
import { performDeepSearch } from '../api/youtubeApi';
import { useAnalysis } from '../context/AnalysisContext';
import YouTubeVideo from '../components/items/YouTubeVideo';

const DeepSearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { query, claimId, claimText, context, timestamp } = location.state || {};
    const { isDarkMode } = useTheme();
    const { videoUrl } = useAnalysis();
    
    const [isLoading, setIsLoading] = useState(true);
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const [showCitations, setShowCitations] = useState(false);
    const [parsedResult, setParsedResult] = useState(null);

    useEffect(() => {
        const performSearch = async () => {
            try {
                setIsLoading(true);
                
                const fullQuery = `
                CLAIM:
                """
                ${claimText}
                """
                
                CONTEXT:
                """
                ${context}
                """
                
                Please:
                1. Analyze this claim objectively without political bias
                2. Find reliable sources that confirm or contradict this claim
                3. Present evidence from multiple perspectives when relevant
                4. Note any important nuance, context, or qualifications missing from the original claim
                5. Assess the overall accuracy on a scale from "Completely False" to "Completely True"
                6. Explain specifically what parts are accurate or inaccurate if the claim is partially true
                7. Cite specific sources, studies, statistics or expert consensus that support your assessment
                
                Use this search query as a starting point: ${query}
                `;

                const result = await performDeepSearch(fullQuery);
                
                if (typeof result === 'string' && result.includes('Error')) {
                    setError(result);
                    setSearchResult(null);
                } else {
                    // Store the result in localStorage
                    localStorage.setItem(`search-${claimId}`, JSON.stringify(result));
                    
                    setSearchResult(result);
                    const content = result.choices[0].message.content;
                    setParsedResult(content);
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
    }, [query, context, navigate, claimText, claimId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={`deep-search-page ${isDarkMode ? 'dark' : 'light'}`}>
            <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back to Analysis
            </button>
            
            <h2>Deep Verification</h2>
            
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
                <h3>Verification Results:</h3>
                
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Performing deep verification...</p>
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeepSearchPage; 
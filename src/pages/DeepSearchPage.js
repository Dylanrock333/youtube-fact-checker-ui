import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/DeepSearchPage.css';
import { useTheme } from '../context/ThemeContext';
import { performDeepSearch } from '../api/youtubeApi';

const DeepSearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { query, claimId, claimText, context } = location.state || {};
    const { isDarkMode } = useTheme();
    
    const [isLoading, setIsLoading] = useState(true);
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const [showCitations, setShowCitations] = useState(false);

  useEffect(() => {
    // Perform deep search API call
    const performSearch = async () => {
      try {
        setIsLoading(true);
        
        // Concatenate query and context for the search
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

        // Call the API
        const result = await performDeepSearch(fullQuery);
        
        if (typeof result === 'string' && result.includes('Error')) {
          setError(result);
          setSearchResult(null);
        } else {
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

    if (query) {
      performSearch();
    } else {
      navigate('/');
    }
  }, [query, context, navigate, claimText]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleCitations = () => {
    setShowCitations(!showCitations);
  };

  // Format the Sonar Pro result for display
  const formatSonarResult = (result) => {
    if (!result) return null;
    
    // Check if it's a Sonar Pro result with the expected structure
    if (result.model === 'sonar-pro' && result.choices && result.choices.length > 0) {
      const content = result.choices[0].message.content;
      const citations = result.citations || [];
      
      // Parse content to make citations clickable
      const parsedContent = parseContentWithCitations(content, citations);
      
      return (
        <div className="sonar-result">
          <div className="sonar-content">
            {parsedContent}
          </div>
          
          <div className="citations-container">
            <button 
              className="citations-toggle" 
              onClick={toggleCitations}
            >
              {showCitations ? 'Hide Sources' : 'Show Sources'} 
              {showCitations ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            
            {showCitations && (
              <div className="citations-list">
                <h4>Sources:</h4>
                <ol>
                  {citations.map((citation, index) => (
                    <li key={index}>
                      <a 
                        href={citation} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {citation}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Fallback for other result types
    if (typeof result === 'object') {
      return JSON.stringify(result, null, 2);
    }
    
    return result;
  };

  // Parse content and make citations clickable
  const parseContentWithCitations = (content, citations) => {
    if (!content) return null;
    
    // Regular expression to find citation references like [1], [2], etc.
    const citationRegex = /\[(\d+)\]/g;
    
    // Split the content by citation references
    const parts = content.split(citationRegex);
    
    // Create an array to hold the parsed content
    const parsedContent = [];
    
    for (let i = 0; i < parts.length; i++) {
      // Add the text part
      if (parts[i]) {
        parsedContent.push(<span key={`text-${i}`}>{parts[i]}</span>);
      }
      
      // Add the citation if there is one
      if (i < parts.length - 1 && !isNaN(parts[i + 1])) {
        const citationIndex = parseInt(parts[i + 1], 10) - 1;
        if (citationIndex >= 0 && citationIndex < citations.length) {
          const citation = citations[citationIndex];
          parsedContent.push(
            <a
              key={`citation-${i}`}
              href={citation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-citation"
              title={citation}
            >
              [{parts[i + 1]}]
            </a>
          );
        } else {
          // If citation index is out of bounds, just show the original text
          parsedContent.push(<span key={`citation-text-${i}`}>[{parts[i + 1]}]</span>);
        }
        // Skip the next part as we've already processed it
        i++;
      }
    }
    
    return parsedContent;
  };

  return (
    <div className={`deep-search-page ${isDarkMode ? 'dark' : 'light'}`}>
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft /> Back to Analysis
        </button>
        
        <h2>Deep Verification</h2>
        
        <div className="claim-box">
          <h3>Claim:</h3>
          <p>{claimText || 'No claim provided'}</p>
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
              {formatSonarResult(searchResult)}
            </div>
          )}
        </div>
    </div>
  );
};

export default DeepSearchPage; 
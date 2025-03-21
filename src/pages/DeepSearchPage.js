import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/DeepSearchPage.css';

const DeepSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { query, claimId, claimText, isDarkMode } = location.state || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Simulate API call
    const performSearch = async () => {
      try {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock result
        const result = `Based on a comprehensive search, this claim appears to be ${Math.random() > 0.5 ? 'supported' : 'contradicted'} by multiple sources. The search query "${query}" returned information from reliable sources that ${Math.random() > 0.5 ? 'confirms' : 'challenges'} the key assertions made in this claim.`;
        
        setSearchResult(result);
      } catch (error) {
        setSearchResult(`Error performing deep search: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      performSearch();
    } else {
      navigate('/');
    }
  }, [query, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`deep-search-page ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="deep-search-container">
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft /> Back to Analysis
        </button>
        
        <h2>Deep Verification</h2>
        
        <div className="claim-box">
          <h3>Claim:</h3>
          <p>{claimText || 'No claim provided'}</p>
        </div>
        
        <div className="query-box">
          <h3>Search Query:</h3>
          <p>{query || 'No query provided'}</p>
        </div>
        
        <div className="results-box">
          <h3>Verification Results:</h3>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Performing deep verification...</p>
            </div>
          ) : (
            <div className="result-content">
              {searchResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepSearchPage; 
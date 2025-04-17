import VideoAnalysis from '../components/items/VideoAnalysis';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideo} from '../api/api';
import validateUrl from '../utils/urlDecoder';
import { useLocation } from 'react-router-dom';
import hexagonLoading from '../assets/hexagon-loading.svg';

function AnalysisPage() {
    const { theme } = useTheme();
    const { 
      analysisData, 
      setAnalysisData, 
      videoUrl, 
      setVideoUrl, 
      isAnalyzing, 
      setIsAnalyzing 
    } = useAnalysis();

    const location = useLocation();
    const inputUrl = location.state?.inputUrl;

    useEffect(() => {
        // Define the analysis function
        setIsAnalyzing(true);
        
        const performAnalysis = async () => {
            // Guard against running without a URL - safety check
            if (!inputUrl) {
                console.error("performAnalysis called without inputUrl.");
                setAnalysisData({ error: "No video URL provided." });
                setIsAnalyzing(false);
                return;
            }

            try {
                const { origin, videoID } = validateUrl(inputUrl);
                // Set the videoUrl in context *before* the async call starts
                // This indicates which URL we are currently processing
                setVideoUrl(inputUrl);
                console.log("Attempting analysis for:", inputUrl, origin, videoID);
                const response = await analyzeVideo(inputUrl, origin, videoID);
                console.log("Analysis response:", response);
                // Set the successful analysis data
                setAnalysisData(response);
            } catch (error) {
                console.error('Error analyzing video:', error);
                // Ensure the URL associated with the error is the one we tried
                setVideoUrl(inputUrl);
                // Set the error state in the context
                setAnalysisData({ error: error.message });
            } finally {
                setIsAnalyzing(false);
            }
        };

        if (inputUrl && inputUrl === videoUrl && analysisData && !analysisData.error) {
      
            console.log('Using existing analysis data from context for:', inputUrl);
           
            setIsAnalyzing(false);
        } else if (inputUrl) {

            performAnalysis();
        } else {
            console.error("AnalysisPage loaded without an inputUrl in location state.");
            setAnalysisData({ error: "No video URL provided to analyze." });
            setVideoUrl(''); 
            setIsAnalyzing(false);
        }
        // --- End Decision Logic ---

    // Dependencies: Re-run this effect if the target `inputUrl` changes,
    // or if the relevant context state used in the decision logic changes.
    }, [inputUrl, videoUrl, analysisData, setAnalysisData, setVideoUrl, setIsAnalyzing]);


    return (
        <div>
            {(isAnalyzing || analysisData) && (
                <div className={`result-container ${theme}`}>
                    {isAnalyzing ? (
                    <div className="analysis-loading">
                        <div className="loading-container">
                            <object type="image/svg+xml" data={hexagonLoading} className="loading-hexagon">
                                Loading animation
                            </object>
                            <p>Analyzing video...</p>
                        </div>
                    </div>
                    ) : (
                    analysisData && (
                        analysisData.error ? (
                        <div className="error-message">{analysisData.error}</div>
                        ) : (   
                        <VideoAnalysis 
                            analysisData={analysisData}
                            videoUrl={videoUrl}
                            
                        />
                        )
                    )
                    )}
                </div>
            )}
        </div>
    )
}

export default AnalysisPage;

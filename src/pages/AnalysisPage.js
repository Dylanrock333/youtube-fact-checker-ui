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
        const performAnalysis = async () => {
            setIsAnalyzing(true);


            try {
                const { origin, videoID } = validateUrl(inputUrl);

                setVideoUrl(inputUrl); 
                console.log(inputUrl, origin, videoID);
                const response = await analyzeVideo(inputUrl, origin, videoID);
                console.log(response);

                setAnalysisData(response);
            } catch (error) {
            console.error('Error analyzing video:', error);
                setAnalysisData({ error: error.message });
            } finally {
                setIsAnalyzing(false);
            }
        };

        performAnalysis();
    }, []);

    return (
        <div>
            <h1>Analysis Page</h1>

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

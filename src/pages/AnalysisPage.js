import VideoAnalysis from '../components/items/VideoAnalysis';
import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideo} from '../api/api';
import validateUrl from '../utils/urlDecoder';
import hexagonLoading from '../assets/hexagon-loading.svg';
import "../styles/AnalysisPage.css";

function AnalysisPage() {
    const { theme } = useTheme();
    const { 
      analysisData, 
      setAnalysisData, 
      videoUrl,
      isAnalyzing, 
      setIsAnalyzing,
      isInitialized,
    } = useAnalysis();

    useEffect(() => {

        if (!isInitialized) {
            console.log("AnalysisPage is not initialized.");
            return;
        }

        console.log("useEffect triggered:", videoUrl, analysisData);
    
        const performAnalysis = async () => {
            // Guard against running without a URL - safety check
            if (!videoUrl) {
                console.error("performAnalysis called without inputUrl.");
                setAnalysisData({ error: "No video URL provided." });
                setIsAnalyzing(false);
                return;
            }

            try {
           
                console.log("Attempting analysis for:", videoUrl, origin, videoID);
                const response = await analyzeVideo(videoUrl, origin, videoID);
                console.log("Analysis response:", response);
                setAnalysisData(response);

            } catch (error) {

                console.error('Error analyzing video:', error);
                setAnalysisData({ error: error.message });
            } finally {

                setIsAnalyzing(false);
            }
        };

        const { origin, videoID } = validateUrl(videoUrl);
        
        const currentVideoId = analysisData?.videoID;

        if (videoUrl && analysisData && !analysisData.error && currentVideoId === videoID) {
            // Use existing data, ensure loading is off
            console.log('Using existing analysis data from context for:', videoUrl);
            if (isAnalyzing) setIsAnalyzing(false); 
        } else if (videoUrl) {

            console.log("Starting analysis for:", videoUrl);
            performAnalysis();
        } else {
           
            console.error("AnalysisPage loaded without an url in context.");
            setAnalysisData({ error: "No video URL provided to analyze." });
            if (isAnalyzing) setIsAnalyzing(false);
        }
    

    }, [videoUrl, analysisData, isInitialized, setIsAnalyzing, setAnalysisData]);


    return (
        <div className="analysis-page">
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

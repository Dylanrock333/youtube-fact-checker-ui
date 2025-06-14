import VideoAnalysis from '../components/items/VideoAnalysis';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideoWithProgress } from '../api/api';
import validateUrl from '../utils/urlDecoder';
import HexagonLoader from '../components/items/hexagon-loading';
import "../styles/AnalysisPage.css";
import { useTranslation } from '../translation/useTranslation';

function AnalysisPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { 
      analysisData, 
      setAnalysisData, 
      videoUrl,
      isAnalyzing, 
      setIsAnalyzing,
      isInitialized,
      currentLanguage
    } = useAnalysis();

    // State for streaming progress
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {

        if (!isInitialized) {
            console.log("AnalysisPage is not initialized.");
            return;
        }

        const performAnalysis = () => {
            const { origin, videoID } = validateUrl(videoUrl);

            if (!videoID) {
                console.error("performAnalysis called with invalid videoUrl.");
                setAnalysisData({ error: "Invalid video URL provided." });
                setIsAnalyzing(false);
                return;
            }
            
            // Reset progress state for new analysis
            setPercentage(5);

            const payload = {
                url: videoUrl,
                origin,
                videoID,
                selectedLanguage: currentLanguage
            };

            const callbacks = {
                onProgress: (progressUpdate) => {
                    console.log('Progress:', progressUpdate);
                    setPercentage(progressUpdate.percentage);
                    
                },
                onComplete: (result) => {
                    console.log('Analysis Complete:', result);
                    setAnalysisData(result);
                    setPercentage(100);
                    // Delay hiding the loader to show "complete" status
                    setTimeout(() => setIsAnalyzing(false), 500);
                },
                onError: (err) => {
                    console.error('Analysis Error:', err);
                    setAnalysisData({ error: err.message || t('analysis.error') });
                    setIsAnalyzing(false);
                }
            };

            // Start the analysis
            analyzeVideoWithProgress(payload, callbacks);
        };

        const { videoID } = validateUrl(videoUrl);
        const currentVideoId = analysisData?.videoID;

        if (videoUrl && analysisData && !analysisData.error && currentVideoId === videoID) {
            console.log('Using existing analysis data from context for:', videoUrl);
            if (isAnalyzing) setIsAnalyzing(false); 
        } else if (videoUrl) {
            console.log("Starting analysis for:", videoUrl);
            performAnalysis();
        } else {
            console.error("AnalysisPage loaded without a url in context.");
            setAnalysisData({ error: "No video URL provided to analyze." });
            if (isAnalyzing) setIsAnalyzing(false);
        }
    
    // The dependency array is intentionally kept from the original to avoid re-triggering analysis on progress state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoUrl, isInitialized, setAnalysisData, setIsAnalyzing, currentLanguage]);


    return (
        <div className="analysis-page">
            {(isAnalyzing || analysisData) && (
                <div className={`result-container ${theme}`}>
                    {isAnalyzing ? (
                    <div className="analysis-loading">
                        <HexagonLoader 
                            className="loading-hexagon" 
                            isVisible={isAnalyzing}
                        />
                        <p>{t('analysis.loading')}</p>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
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

import VideoAnalysis from '../components/items/VideoAnalysis';
import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideo} from '../api/api';
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

    useEffect(() => {

        if (!isInitialized) {
            console.log("AnalysisPage is not initialized.");
            return;
        }

        console.log("useEffect triggered:", videoUrl);
    
        const performAnalysis = async () => {
            // Guard against running without a URL - safety check
            if (!videoUrl) {
                console.error("performAnalysis called without inputUrl.");
                setAnalysisData({ error: "No video URL provided." });
                setIsAnalyzing(false);
                return;
            }

            let attempts = 0;
            const maxAttempts = 2; // Will try initially + 2 retries

            while (attempts < maxAttempts) {
                try {
                    console.log(`Attempt ${attempts + 1} of ${maxAttempts}`);
                    const response = await analyzeVideo(videoUrl, origin, videoID, currentLanguage);
                    console.log("Analysis response:", response);
                    setAnalysisData(response);
                    setIsAnalyzing(false);
                    return; // Success! Exit the function
                } catch (error) {
                    attempts++;
                    if (attempts === maxAttempts) {
                        console.error('Final attempt failed:', error);
                        setAnalysisData({ error: "Error processing video" });
                    } else {
                        console.log(`Attempt ${attempts} failed, retrying...`);
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
                    }
                }
            }

            setIsAnalyzing(false);
        };

        const { origin, videoID } = validateUrl(videoUrl); //TODO: maybe add better error handling here
        
        const currentVideoId = analysisData?.videoID;

        //TODO: add better error handling here and conditions here
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
    

    }, [videoUrl, isInitialized, setIsAnalyzing, setAnalysisData]);


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
                    </div>
                    ) : (
                    analysisData && (
                        analysisData.error ? (
                        <div className="error-message">{t('analysis.error')}</div>
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

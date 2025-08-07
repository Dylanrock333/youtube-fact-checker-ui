import VideoAnalysis from '../components/items/VideoAnalysis';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeVideoWithProgress } from '../api/api';
import validateUrl from '../utils/urlDecoder';
import HexagonLoader from '../components/items/hexagon-loading';
import "../styles/AnalysisPage.css";
import { useTranslation } from '../translation/useTranslation';
import { requestWakeLock, releaseWakeLock } from '../utils/wakeLock';
import Analytics from '../utils/analytics';
import { useTimingTracker } from '../hooks/useAnalytics';

function AnalysisPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [searchParams] = useSearchParams();
    const { 
      analysisData, 
      setAnalysisData, 
      videoUrl,
      setVideoUrl,
      isAnalyzing, 
      setIsAnalyzing,
      isInitialized,
      currentLanguage
    } = useAnalysis();

    // State for streaming progress
    const [percentage, setPercentage] = useState(0);
    
    // Track analysis timing
    const { trackTiming: trackAnalysisTime } = useTimingTracker('performance', 'video_analysis_time');

    // Check for videoId parameter in URL and set it in context
    useEffect(() => {
        // Handle both 'videoId' and 'videoID' parameter variations
        const videoIdParam = searchParams.get('videoId') || searchParams.get('videoID');
        if (videoIdParam) {
            try {
                // Construct YouTube URL from videoId parameter
                const youtubeUrl = `https://www.youtube.com/watch?v=${videoIdParam}`;
                
                // Check if this is a different video than what's currently loaded
                const currentVideoId = analysisData?.videoID;
                const isDifferentVideo = !videoUrl || currentVideoId !== videoIdParam;
                
                if (isDifferentVideo) {
                    console.log('Direct link detected - clearing existing data and starting fresh analysis for:', youtubeUrl);
                    // Clear existing analysis data to force fresh analysis
                    setAnalysisData(null);
                    // Set analyzing state to show loading animation
                    setIsAnalyzing(true);
                    // Set the new video URL, which will trigger analysis
                    setVideoUrl(youtubeUrl);
                }
            } catch (error) {
                console.error('Error constructing URL from parameter:', error);
                setAnalysisData({ error: `Invalid video ID parameter: ${videoIdParam}` });
            }
        }
    }, [searchParams, videoUrl, setVideoUrl, setAnalysisData, analysisData]);

    useEffect(() => {
        // Request the wake lock when analysis is about to start
        requestWakeLock();

        if (!isInitialized) {
            console.log("AnalysisPage is not initialized.");
            releaseWakeLock(); // Release if we don't start
            return;
        }

        const performAnalysis = () => {
            const { origin, videoID } = validateUrl(videoUrl);

            if (!videoID) {
                console.error("performAnalysis called with invalid videoUrl.");
                setAnalysisData({ error: "Invalid video URL provided." });
                setIsAnalyzing(false);
                releaseWakeLock(); // Release on validation fail
                return;
            }
            
            // Reset progress state for new analysis
            setPercentage(5);
            
            // Track analysis start
            Analytics.trackAnalysisStep('analysis_started', {
              video_id: videoID,
              language: currentLanguage
            });

            const payload = {
                url: videoUrl,
                origin,
                videoID,
                selectedLanguage: currentLanguage
            };

            const callbacks = {
                onProgress: (progressUpdate) => {
                    console.log('Progress:', progressUpdate);
                    setPercentage(prev => progressUpdate.percentage > prev ? progressUpdate.percentage : prev);
                },
                onComplete: (result) => {
                    console.log('Analysis Complete:', result);
                    setAnalysisData(result);
                    setPercentage(100);
                    
                    // Track successful analysis completion
                    trackAnalysisTime('analysis_completed');
                    Analytics.trackAnalysisStep('analysis_completed', {
                      video_id: videoID,
                      claim_count: result.claim_count || 0,
                      language: currentLanguage
                    });
                    
                    // Delay hiding the loader to show "complete" status
                    setTimeout(() => setIsAnalyzing(false), 500);
                    releaseWakeLock(); // Release on success
                },
                onError: (err) => {
                    console.error('Analysis Error:', err);
                    setAnalysisData({ error: err.message || t('analysis.error') });
                    
                    // Track analysis error
                    Analytics.trackError('analysis_error', err.message, {
                      video_id: videoID,
                      language: currentLanguage,
                      progress_percentage: percentage
                    });
                    
                    setIsAnalyzing(false);
                    releaseWakeLock(); // Release on error
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

        // Cleanup function to release the lock if the component unmounts
        return () => {
            releaseWakeLock();
        };
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

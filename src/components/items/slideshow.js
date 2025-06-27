import React, { useEffect, useRef } from 'react';
import { slideshowItem } from '../../translation/slideshow-item';
import './slideshow.css';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import { RiArrowLeftWideFill, RiArrowRightWideLine  } from "react-icons/ri";
import { useAnalysis } from '../../context/AnalysisContext';
import { useNavigate } from 'react-router-dom';

const SlideshowItemComponent = ({ item }) => {
    const glideRef = useRef(null);
    const { videoUrl, setVideoUrl, setIsAnalyzing } = useAnalysis();
    const navigate = useNavigate();
    useEffect(() => {
        if (!glideRef.current || item.claims.length <= 3) {
            return;
        }

        const randomInterval = Math.floor(Math.random() * (8000 - 4000 + 1)) + 6000;

        const glide = new Glide(glideRef.current, {
            type: 'carousel',
            perView: 2.3,
            gap: 20,
            autoplay: randomInterval,
            animationDuration: 800,
            animationTimingFunc: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            touchRatio: 1,
            swipeThreshold: 20,
            dragThreshold: 30,
            breakpoints: {
                1250: {
                    perView: 1.75
                },
                1100: {
                    perView: 1.25
                },
                1000: {
                    perView: 1.125
                },
                950: {
                    perView: 1.15
                },
                900: {
                    perView: 1.1
                },
                850: {
                    perView: 1.05
                },
                800: {
                    perView: 1
                }
            }
        });

        glide.mount();

        return () => {
            glide.destroy();
        };
    }, [item.claims]);

    const handleAnalysisClick = (videoUrl) => {
        setVideoUrl(videoUrl);
        setIsAnalyzing(true);
        navigate('/analysis-page');
    };


    const handleStartDeepSearch = (claim, videoUrl) => {
        if (window.gtag) {
          window.gtag('event', 'deep_search_click');
        }
        setVideoUrl(videoUrl);

        const query = claim.searchQuery;
        const claimId = -1;
        const claimText = claim.claimQuote;
        const context = claim.claimContext;
        const timestamp = claim.timestamp;
        const videodata = [];
    
        navigate('/deep-search', { 
          state: { 
            query, 
            claimId, 
            claimText,
            context,
            timestamp,
            videodata
          } 
        });
    };

    return (
        <div className="slideshow-item">
            <div className="slideshow-item-left">
                <div>
                    <img src={item.thumbnail} alt={item.videoTitle} />
                    <div className="video-info-container">
                        <h2>{item.videoTitle}</h2>
                        <div className="video-info-container-bottom">
                            <span>{item.channel}</span>
                        </div>
                    </div>
                </div>
                <button className="slideshow-item-claim__button" onClick={() => handleAnalysisClick(item.videoUrl)}>Analyze Video</button>
            </div>
            <div className="slideshow-item-claims-container">
                {item.claims.length > 3 ? (
                    <div className="glide" ref={glideRef}>
                        <div className="glide__track" data-glide-el="track">
                            <ul className="glide__slides">
                                {item.claims.map((claim, claimIndex) => (
                                    <li key={claimIndex} className="glide__slide">
                                        <div className="slideshow-item-claim">
                                            <div className="claim-title-container">
                                                <h3 className="claim-title">{claim.claimTitle}</h3>
                                            </div>
                                            <h3 className="timestamp">Timestamp: {claim.timestamp}</h3>
                                            <div className="claim-info-container">
                                                <p className="claim-quote">{claim.claimQuote}</p>
                                            </div>
                                            <div className="claim-context-container">
                                            <p className="claim-context-slideshow">{claim.claimContext}</p>
                                            </div>
                                            <button className="slideshow-item-claim__button" onClick={() => handleStartDeepSearch(claim, item.videoUrl)}>Start Deep Search</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="glide__arrows" data-glide-el="controls">
                            <button className="glide__arrow glide__arrow--left" data-glide-dir="<"><RiArrowLeftWideFill /></button>
                            <button className="glide__arrow glide__arrow--right" data-glide-dir=">"><RiArrowRightWideLine   /></button>
                        </div>
                    </div>
                ) : (
                    <div className="slideshow-item-claims">
                        {item.claims.map((claim, claimIndex) => (
                            <div key={claimIndex} className="slideshow-item-claim">
                                    <div className="claim-title-container">
                                    <h3 className="claim-title">{claim.claimTitle}</h3>
                                    <h3 className="timestamp">Timestamp: {claim.timestamp}</h3>
                                </div>
                                <div className="claim-text-container">
                                    <p>Claim Quote: {claim.claimQuote}</p>
                                    <p>Claim Context: {claim.claimContext}</p>
                                </div>
                                <button className="slideshow-item-claim__button">Start Deep Search</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Slideshow = () => {
    return (
        <div>
            <div className="section-header">
                <h2 className="section-title">NOT SURE WHAT TO ANALYZE?</h2>
                <p className="section-subtext">Discover what we found in popular videos this week.</p>
            </div>
            <div className="slideshow-container">
                {slideshowItem.map((item, index) => (
                    <SlideshowItemComponent key={index} item={item} />
                ))}
            </div>            
        </div>
    );
};

export default Slideshow;
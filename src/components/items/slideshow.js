import React, { useEffect, useRef, useState } from 'react';
import slideshowData from '../../config/res_slideshow.json';
import './slideshow.css';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import { RiArrowLeftWideFill, RiArrowRightWideLine  } from "react-icons/ri";
import { useAnalysis } from '../../context/AnalysisContext';
import { useNavigate } from 'react-router-dom';
import ClaimCard from './ClaimCard';
// import { getSlideshowItem } from '../../api/api';
import Analytics from '../../utils/analytics';


const SlideshowItemComponent = ({ item }) => {
    const glideRef = useRef(null);
    const { setVideoUrl, setIsAnalyzing } = useAnalysis();
    const navigate = useNavigate();
    const equalizeCardHeights = (containerRef = null) => {
        const container = containerRef || glideRef.current;
        if (!container) return;
        
        const claimCards = container.querySelectorAll('.claim-card');
        if (claimCards.length === 0) return;
        
        // Reset heights
        claimCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Find max height among visible cards
        let maxHeight = 0;
        claimCards.forEach(card => {
            const height = card.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        
        // Apply max height to all cards
        claimCards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    };

    const staticClaimsRef = useRef(null);

    // Effect for equalizing static claim heights
    useEffect(() => {
        if (item.claims.length <= 3 && staticClaimsRef.current) {
            setTimeout(() => equalizeCardHeights(staticClaimsRef.current), 100);
        }
    }, [item.claims]);

    useEffect(() => {
        if (!glideRef.current || item.claims.length <= 3) {
            return;
        }

        const randomInterval = Math.floor(Math.random() * (8000 - 4000 + 1)) + 6000;

        const glide = new Glide(glideRef.current, {
            type: 'carousel',
            perView: 2.1,
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
                    perView: 1
                },
                800: {
                    perView: 2
                },
                675: {
                    perView: 1
                }
            }
        });

        glide.mount();

        // Equalize heights after mount and on slide changes
        setTimeout(equalizeCardHeights, 100);
        glide.on('run', () => {
            setTimeout(equalizeCardHeights, 100);
        });

        return () => {
            glide.destroy();
        };
    }, [item.claims]);

    const handleAnalysisClick = (videoUrl) => {
        Analytics.trackSlideshowInteraction('video_analyze', videoUrl);
        Analytics.trackVideoAnalysisAttempted('slideshow_example');
        
        setVideoUrl(videoUrl);
        setIsAnalyzing(true);
        navigate('/analysis');
    };


    const handleStartDeepSearch = (claimId) => {
        const claim = item.claims.find(c => c.id === claimId);
        if (!claim) return;
        
        Analytics.trackSlideshowInteraction('deep_search', item.videoUrl, claim.claimTitle);
        
        setVideoUrl(item.videoUrl);

        const query = claim.searchQuery;
        const claimTitle = claim.claimTitle;
        const claimText = claim.claimQuote;
        const context = claim.claimContext;
        const timestamp = claim.timestamp;
        const videodata = [];
    
        navigate('/deep-search', { 
          state: { 
            query, 
            claimId, 
            claimTitle,
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
                    <div className="video-info-container dark">
                        <h2>{item.videoTitle}</h2>
                        <div className="video-info-container-bottom">
                            <span>{item.channel}</span>
                        </div>
                    </div>
                </div>
                <button className="slideshow-item-claim__button" onClick={() => handleAnalysisClick(item.videoUrl)}>Start Video Analysis</button>
            </div>
            <div className="slideshow-item-claims-container">
                {item.claims.length > 3 ? (
                    <div className="glide" ref={glideRef}>
                        <div className="glide__track" data-glide-el="track">
                            <ul className="glide__slides">
                                {item.claims.map((claim, claimIndex) => (
                                    <li key={claimIndex} className="glide__slide">
                                        <ClaimCard 
                                            claim={{
                                                id: claimIndex,
                                                timestamp: claim.timestamp,
                                                category: claim.category || 'general',
                                                title: claim.claimTitle,
                                                claim: claim.claimQuote,
                                                context: claim.claimContext
                                            }}
                                            onStartDeepSearch={handleStartDeepSearch}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* <div className="glide__arrows" data-glide-el="controls">
                            <button className="glide__arrow glide__arrow--left" data-glide-dir="<"><RiArrowLeftWideFill /></button>
                            <button className="glide__arrow glide__arrow--right" data-glide-dir=">"><RiArrowRightWideLine   /></button>
                        </div> */}
                    </div>
                ) : (
                    <div className="slideshow-item-claims" ref={staticClaimsRef}>
                        {item.claims.map((claim, claimIndex) => (
                            <ClaimCard 
                                key={claimIndex}
                                claim={{
                                    id: claimIndex,
                                    timestamp: claim.timestamp,
                                    category: claim.category || 'general',
                                    title: claim.claimTitle,
                                    claim: claim.claimQuote,
                                    context: claim.claimContext
                                }}
                                onStartDeepSearch={handleStartDeepSearch}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Slideshow = () => {
    const [slideshowItems, setSlideshowItems] = useState([]);
    const [apiData, setApiData] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchSlideshowData = async () => {
            try {
                // const data = await getSlideshowItem();
                const data = slideshowData;
                setApiData(data);
                const availableCategories = Object.keys(data);
                setCategories(availableCategories);
                if (availableCategories.length > 0) {
                    setSelectedCategory(availableCategories[0]);
                }
            } catch (error) {
                console.error("Failed to fetch slideshow items:", error);
            }
        };

        fetchSlideshowData();
    }, []);

    useEffect(() => {
        if (selectedCategory && apiData[selectedCategory]) {
            const items = apiData[selectedCategory].map(item => ({
                videoTitle: item.title,
                channel: item.channel_title,
                thumbnail: `https://i.ytimg.com/vi/${item.video_id}/hqdefault.jpg`,
                videoUrl: `https://www.youtube.com/watch?v=${item.video_id}`,
                claims: item.claims.map(claim => ({
                    claimTitle: claim.title,
                    claimQuote: claim.claim,
                    claimContext: claim.context,
                    timestamp: claim.timestamp,
                    category: claim.category,
                    searchQuery: claim.search_query
                }))
            }));
            setSlideshowItems(items);
        }
    }, [selectedCategory, apiData]);

    return (
        <div>
            <div className="section-header">
                <h2 className="section-title">NOT SURE WHAT TO ANALYZE?</h2>
                <p className="section-subtext">Discover what we found in popular videos this week.</p>
            </div>
            <div className="category-buttons">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => {
                          Analytics.trackSlideshowInteraction('category_select', null, null, category);
                          setSelectedCategory(category);
                        }}
                    >
                        {category.replace(/_/g, ' ').toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="slideshow-container">
                {slideshowItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <SlideshowItemComponent item={item} />
                        {index < slideshowItems.length - 1 && (
                            <hr className="slideshow-divider" />
                        )}
                    </React.Fragment>
                ))}
            </div>            
        </div>
    );
};

export default Slideshow;
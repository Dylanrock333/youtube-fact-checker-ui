import React, { useEffect, useRef } from 'react';
import { slideshowItem } from '../../translation/slideshow-item';
import './slideshow.css';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';

const SlideshowItemComponent = ({ item }) => {
    const glideRef = useRef(null);

    useEffect(() => {
        if (!glideRef.current || item.claims.length <= 3) {
            return;
        }

        const glide = new Glide(glideRef.current, {
            type: 'slider',
            perView: 3,
            gap: 20,
            bound: true,
        });

        glide.mount();

        return () => {
            glide.destroy();
        };
    }, [item.claims]);

    return (
        <div className="slideshow-item">
            <div className="slideshow-item-left">
                <div>
                    <img src={item.thumbnail} alt={item.videoTitle} />
                    <h2>{item.videoTitle}</h2>
                    <h1>{item.channel}</h1>
                </div>
            </div>
            <div className="slideshow-item-claims-container">
                {item.claims.length > 3 ? (
                    <div className="glide" ref={glideRef}>
                        <div className="glide__track" data-glide-el="track">
                            <ul className="glide__slides">
                                {item.claims.map((claim, claimIndex) => (
                                    <li key={claimIndex} className="glide__slide">
                                        <div className="slideshow-item-claim">
                                            <h3>Timestamp: {claim.timestamp}</h3>
                                            <h3>{claim.claimTitle}</h3>
                                            <p>Claim Quote: {claim.claimQuote}</p>
                                            <p>Claim Context: {claim.claimContext}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="glide__arrows" data-glide-el="controls">
                            <button className="glide__arrow glide__arrow--left" data-glide-dir="<">‹</button>
                            <button className="glide__arrow glide__arrow--right" data-glide-dir=">">›</button>
                        </div>
                    </div>
                ) : (
                    <div className="slideshow-item-claims">
                        {item.claims.map((claim, claimIndex) => (
                            <div key={claimIndex} className="slideshow-item-claim">
                                <h3>Timestamp: {claim.timestamp}</h3>
                                <h3>{claim.claimTitle}</h3>
                                <p>Claim Quote: {claim.claimQuote}</p>
                                <p>Claim Context: {claim.claimContext}</p>
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
        <div className="slideshow-container">
            {slideshowItem.map((item, index) => (
                <SlideshowItemComponent key={index} item={item} />
            ))}
        </div>
    );
};

export default Slideshow;
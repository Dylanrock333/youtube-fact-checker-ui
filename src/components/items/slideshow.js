import React from 'react';
import { slideshowItem } from '../../translation/slideshow-item';
import './slideshow.css';

const Slideshow = () => {
    return (
        <div className="slideshow-container">
            {slideshowItem.map((item, index) => (
                <div key={index} className="slideshow-item">
                    <div className="slideshow-item-left">
                        <img src={item.thumbnail} alt={item.videoTitle} />
                        <h2>{item.videoTitle}</h2>
                    </div>
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
                </div>
            ))}
        </div>
    );
};

export default Slideshow;
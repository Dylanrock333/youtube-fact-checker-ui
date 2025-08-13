import React from 'react';
import '../styles/About.css';  // Added CSS import

function About() {
  return (
    <div className="page-content">
      <h1>About</h1>
      
      <div className="about-intro">
        Video Claim Catcher analyzes YouTube videos for both fact-checkable and educational content. Simply paste any YouTube link, and our AI will analyze the transcript to identify specific claims and statements made in the video that can be verified against reliable sources while also providing deeper context and background information. Get instant access to both the facts and the fuller picture in any video so you can transform watching into knowing.
      </div>

      <div className="about-section">
        <p>
          As YouTube's position as the world's largest media platform continues to grow, the volume of unchecked information expands exponentially. In today's landscape of rampant misinformation, Video Claim Catcher empowers viewers to navigate the nuances of statements presented in video content. I designed this tool to help users efficiently evaluate content credibility. Beyond simple fact-checking, Video Claim Catcher creates comprehensive information profiles for each video, enabling deeper understanding of diverse topics. The application bridges the gap between passive consumption and active learning by transforming viewing experiences into opportunities for research and discovery. It gives viewers the tools to instantly verify claims, explore supporting evidence, and gain contextual understanding—all in a digestible format that doesn't require hours of independent research. By making knowledge verification accessible and efficient, Video Claim Catcher helps users build media literacy and critical thinking skills while ensuring they can confidently separate reliable information from questionable assertions in the content they consume.
        </p>

        <p>
          This sophisticated application utilizes advanced language models to power two specialized AI components: the Analyzing Agent and the Deep Search Agent. The Analyzing Agent processes video transcripts to identify statements containing historical references, factual assertions, logical arguments, statistical data, or verifiable claims. Each detected statement is accompanied by a contextual summary that frames the claim within its surrounding discussion and subject matter. The system evaluates each claim across three metrics: Controversy, Video Relevance, and Checkability. It then formulates precise search parameters that the Deep Search Agent uses to conduct internet research. The Deep Search Agent will then execute a targeted web searches based on these parameters. It synthesizes findings into concise summaries supported by attribution to credible sources. This provides users with both immediate insights and pathways for deeper investigation through retrived citations.
        </p>

        <p>
          While this technology represents a significant advancement, it has inherent limitations including inconsistent claim identification due to the probabilistic nature of language models, transcript quality issues, and an inability to independently verify source credibility—making user judgment essential for the verification process. Nevertheless, Video Claim Catcher delivers exceptional value through its contextual comprehension, claim extraction, and targeted research abilities, empowering you to engage more meaningfully with content whether you're fact-checking important claims, satisfying intellectual curiosity, or exploring complex subjects to discover both facts and broader context behind what you watch.
        </p>

        <p> 
          If you're interested in learning more about the technology behind Video Claim Catcher, or would like to to work together, please reach out to me using the 'Contact Us' link at the bottom of the page.
        </p>
      </div>
    </div>
  );
}

export default About; 
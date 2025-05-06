import React from 'react';
import '../styles/About.css';  // Added CSS import

function About() {
  return (
    <div className="page-content">
      <h1>About</h1>
      
      <div className="about-intro">
        Video Claim Catcher analyzes YouTube videos for both fact-checkable and educational content. 
        Simply paste any YouTube link, and our AI will analyze the transcript to identify specific claims and statements made in the video that can be verified against reliable sources while also providing deeper context and background information.
        Get instant access to both the facts and the fuller picture in any video so you can transform watching into knowing.
      </div>

      <div className="about-section">
        <p>
          As an engineer passionate about merging technical expertise with creative innovation, I'm captivated by the transformative potential of artificial intelligence. 
          Video Claim Catcher exemplifies how Large Language Models can extract meaning from content, restructure information, and make agentic assessments. 
          The agenticity of AI represents just one example of how these capabilities, when thoughtfully implemented, can revolutionize numerous fields and streamline complex tasks.
        </p>

        <p>
          As YouTube's position as the world's largest media platform continues to grow, the volume of unchecked information expands exponentially. 
          In today's landscape of rampant misinformation, Video Claim Catcher empowers viewers to navigate the nuances of statements presented in video content.
          I designed this tool to help users efficiently evaluate content credibility. 
          Beyond simple fact-checking, Video Claim Catcher creates comprehensive information profiles for each video, enabling deeper understanding of diverse topics. 
          The application serves both as a verification system for assessing statement validity and as a knowledge expansion tool that contextualizes information within broader discussions.
        </p>

        <p>
          This sophisticated application utilizes advanced language models to power two specialized AI components: the Analyzing Agent and the Deep Search Agent.
          The Analyzing Agent processes video transcripts through Gemini to identify statements containing historical references, factual assertions, logical arguments, statistical data, or verifiable claims. 
          Each detected statement is accompanied by a contextual summary that frames the claim within its surrounding discussion and subject matter.
          The system evaluates each claim across three dimensions: Controversy, Video Relevance, and Checkability. It then formulates precise search parameters that the Deep Search Agent uses to conduct internet research.
          The Deep Search Agent leverages Perplexity to execute targeted web searches based on these parameters. 
          It synthesizes findings into concise summaries supported by attribution to credible sources. 
          This provides users with both immediate insights and pathways for deeper investigation through retrived citations.
        </p>

        <p>
          While this technology represents a significant advancement, it faces inherent limitations including the probabilistic nature of language models that may yield inconsistent claim identification,and transcript quality issues that affect accuracy.
          Additionally, while the system utilizes Perplexity to evaluate claims using internet resources, it cannot independently verify source credibility, making user judgment an essential component of the verification process.
        </p>

        <p>
          Despite prioritizing authoritative references, the system has inherent limitations in distinguishing between reliable and unreliable information, making user discretion essential for critical matters.
          Despite these constraints, Video Claim Catcher delivers exceptional value through its contextual comprehension capabilities, claim extraction functionality, and targeted research abilities. 
          It serves diverse purposes spanning from verification needs to curiosity satisfaction to comprehensive topic exploration.
          Whether you're fact-checking important claims, satisfying intellectual curiosity, or diving deeper into complex subjects, Video Claim Catcher empowers you to engage more meaningfully with content and discover both the facts and the broader context behind what you watch.
        </p>

        <p> 
          If you're interested in learning more about the technology behind Video Claim Catcher, or would like to to work together, please reach out to me at in the contact us section at the bottom of the page.
        </p>
      </div>
    </div>
  );
}

export default About; 
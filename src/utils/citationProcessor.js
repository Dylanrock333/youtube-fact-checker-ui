import React from 'react';
import { marked } from 'marked';

/**
 * Processes text content and replaces citation patterns [number] with styled citation links
 * @param {string} content - The markdown content to process
 * @param {Array} citations - Array of citation URLs
 * @returns {string} - Processed content with citation links
 */
export const processCitations = (content, citations = []) => {
  if (!content || typeof content !== 'string') {
    return content;
  }

  // Configure marked to handle HTML
  marked.setOptions({
    breaks: true,
    gfm: true,
    sanitize: false // Allow HTML since we're controlling the content
  });

  // Regular expression to find citations in the format [number]
  const citationRegex = /\[(\d+)\]/g;
  
  // Replace citation patterns with styled citation links
  const processedContent = content.replace(citationRegex, (match, number) => {
    const citationIndex = parseInt(number) - 1; // Convert to 0-based index
    
    if (citations && citations[citationIndex]) {
      // Create an HTML link that will be styled by our CSS
      return `<a href="${citations[citationIndex]}" target="_blank" rel="noopener noreferrer" class="citation-link">${number}</a>`;
    }
    
    // If no citation URL available, still style the citation number
    return `<span class="citation-link">${number}</span>`;
  });

  // Convert markdown to HTML
  const htmlContent = marked(processedContent);
  
  return htmlContent;
};

/**
 * React component that renders citations with proper styling
 * @param {Object} props - Component props
 * @param {string} props.content - The content to render
 * @param {Array} props.citations - Array of citation URLs
 * @returns {JSX.Element} - Rendered content with styled citations
 */
export const CitationRenderer = ({ content, citations = [] }) => {
  const processedContent = processCitations(content, citations);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: processedContent }}
      className="citation-content"
    />
  );
};

/**
 * Custom ReactMarkdown components for handling citations
 */
export const markdownComponents = {
  p: ({ children, ...props }) => {
    // Process paragraph content for citations
    if (typeof children === 'string') {
      const processedContent = processCitations(children);
      return (
        <p {...props} dangerouslySetInnerHTML={{ __html: processedContent }} />
      );
    }
    return <p {...props}>{children}</p>;
  },
  
  // Handle text nodes that might contain citations
  text: ({ children, ...props }) => {
    if (typeof children === 'string') {
      const processedContent = processCitations(children);
      if (processedContent !== children) {
        return <span dangerouslySetInnerHTML={{ __html: processedContent }} />;
      }
    }
    return children;
  }
};
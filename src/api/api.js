import { API_ENDPOINTS } from '../config/constants';

// Create a helper function to get the base URL
const getBaseUrl = () => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? API_ENDPOINTS.DEV_LOCAL_URL : API_ENDPOINTS.PROD_BASE_URL;
};

// Replace the existing BASE_URL constant
const BASE_URL = getBaseUrl();

/**
 * Analyzes a video by streaming progress and results from the backend SSE endpoint.
 *
 * @param {object} payload - The data for the analysis request.
 * @param {string} payload.origin - The origin of the video (e.g., 'youtube').
 * @param {string} payload.videoID - The ID of the video.
 * @param {string} payload.selectedLanguage - The language for analysis.
 * @param {object} callbacks - An object containing callback functions.
 * @param {function} callbacks.onProgress - Callback for progress updates. Receives a progress object.
 * @param {function} callbacks.onComplete - Callback for when analysis is complete. Receives the final data object.
 * @param {function} callbacks.onError - Callback for any errors. Receives an error object.
 */
export const analyzeVideoWithProgress = async (
  { url,origin, videoID, selectedLanguage },
  { onProgress, onComplete, onError }
) => {
  // Note: BASE_URL should be defined in your environment, e.g., http://localhost:8000
  const request_url = `${BASE_URL}/execute/stream`;
  console.log('Connecting to SSE endpoint:', request_url);

  try {
    const response = await fetch(request_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // The `url` parameter from your original function is not needed by the backend API.
      body: JSON.stringify({ url, origin, videoID, selectedLanguage }),
    });

    // --- Rate Limit Check ---
    if (response.status === 429) {
      const rateLimitData = await response.json();
      const error = new Error(rateLimitData.message || 'Rate limit reached');
      error.rateLimitData = rateLimitData; 
      sessionStorage.setItem('rateLimitInfo', JSON.stringify({
        isLimited: true,
        resetTime: rateLimitData.resetTime,
        message: rateLimitData.message || 'Rate limit exceeded.'
      }));
      onError(error);
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error starting analysis stream' }));
      throw new Error(errorData.detail || `Error starting stream: ${response.statusText}`);
    }

    // Clear rate limit info on successful connection
    sessionStorage.removeItem('rateLimitInfo');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      // Events are separated by double newlines.
      const events = buffer.split('\n\n');
      // The last event might be incomplete, so we keep it in the buffer.
      buffer = events.pop(); 

      for (const event of events) {
        if (event.startsWith('data: ')) {
          const dataString = event.substring(6);
          if (dataString) {
            try {
              const data = JSON.parse(dataString);

              if (data.status === 'progress') {
                onProgress(data);
              } else if (data.status === 'complete') {
                onComplete(data.data);
                return; // Stream finished successfully
              } else if (data.status === 'error') {
                onError(new Error(data.message));
                return; // Stream finished with an error
              }
            } catch (e) {
              console.error("Failed to parse SSE event data:", dataString, e);
              onError(new Error("Failed to parse a server event."));
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in analyzeVideoWithProgress:", error);
    onError(error);
  }
};

export const analyzeVideo = async (url, origin, videoID, selectedLanguage) => {

  let request_url = `${BASE_URL}/execute`
  console.log('Calling API at:', request_url)
  // Debug logging
  console.log('Request payload:', { url, origin, videoID, selectedLanguage });
  const response = await fetch(request_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, origin, videoID, selectedLanguage })
  });
  
  try { // Wrap in try...catch to handle errors including rate limits

    // --- Rate Limit Check ---
    if (response.status === 429) {
      const rateLimitData = await response.json();
      // Store rate limit info temporarily for UI feedback
      sessionStorage.setItem('rateLimitInfo', JSON.stringify({
        isLimited: true,
        resetTime: rateLimitData.resetTime,
        message: rateLimitData.message || 'Rate limit exceeded.' // Use message from API
      }));
      // Throw a specific error or return a specific structure
      throw new Error(rateLimitData.message || 'Rate limit reached'); 
    }
    // --- End Rate Limit Check ---

    if (!response.ok) {
      // Handle other non-OK responses
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error processing video' }));
      throw new Error(errorData.detail || `Error processing video: ${response.statusText}`);
    }
    
    // Clear any previous rate limit info on success
    sessionStorage.removeItem('rateLimitInfo');

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in analyzeVideo:", error);
    // Re-throw the error so the calling component can handle it
    throw error; 
  }
}; 

export const checkApiHealth = async () => {
  try {
    const healthUrl = `${BASE_URL}${API_ENDPOINTS.HEALTH_CHECK}`;
    console.log('Checking API health at:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Health check failed! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API health check successful:', data);
    return { success: true, message: 'API is connected and healthy', data };
    
  } catch (error) {
    console.error('API health check failed:', error);
    return { success: false, message: `API connection failed: ${error.message}` };
  }
};


export const performDeepSearch = async (query, videodata, context, claimText) => {
  try {
    //console.log(query);
    const searchUrl = `${BASE_URL}/deepsearch`;

    const requestBody = {
      query,
      videoPublishedAt: videodata.published_at,
      videoTags: videodata.tags,
      videoTitle: videodata.title,
      context,
      claimText
    };

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    // --- Rate Limit Check ---
    if (response.status === 429) {
      const rateLimitData = await response.json();
      sessionStorage.setItem('deepSearchRateLimitInfo', JSON.stringify({ // Use a different key if needed
        isLimited: true,
        resetTime: rateLimitData.resetTime,
        message: rateLimitData.message || 'Rate limit exceeded for deep search.'
      }));
      throw new Error(rateLimitData.message || 'Rate limit reached for deep search');
    }
    // --- End Rate Limit Check ---

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    sessionStorage.removeItem('deepSearchRateLimitInfo'); // Clear on success
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error performing deep search:', error);
    // Propagate the error
    throw error; 
  }
};    

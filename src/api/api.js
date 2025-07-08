import { API_ENDPOINTS } from '../config/constants';

// Create a helper function to get the base URL
const getBaseUrl = () => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? API_ENDPOINTS.DEV_LOCAL_URL : API_ENDPOINTS.PROD_BASE_URL;
};

// Replace the existing BASE_URL constant
const BASE_URL = getBaseUrl();

export const analyzeVideoWithProgress = async (
  { url, origin, videoID, selectedLanguage },
  { onProgress, onComplete, onError }
) => {

  if (!window.Worker) {
    console.error("Web Workers are not supported by this browser.");
    onError(new Error("Your browser does not support background processing. Please update to a modern browser."));
    return;
  }

  // Use new URL() to support Create React App's worker loading
  const worker = new Worker(new URL('../workers/analysisWorker.js', import.meta.url));

  worker.onmessage = (event) => {
    const { type, payload } = event.data;

    switch (type) {
      case 'progress':
        onProgress(payload);
        break;
      case 'complete':
        onComplete(payload);
        worker.terminate();
        break;
      case 'error':
        // The payload is expected to be { message: '...' }
        onError(new Error(payload.message));
        worker.terminate();
        break;
      case 'rateLimit':
        const rateLimitError = new Error(payload.message || 'Rate limit reached');
        rateLimitError.rateLimitData = payload; 
        sessionStorage.setItem('rateLimitInfo', JSON.stringify({
          isLimited: true,
          resetTime: payload.resetTime,
          message: payload.message || 'Rate limit exceeded.'
        }));
        onError(rateLimitError);
        worker.terminate();
        break;
      case 'connected':
        // The worker has successfully connected to the stream.
        // Clear any stale rate limit info from previous attempts.
        sessionStorage.removeItem('rateLimitInfo');
        break;
      default:
        console.warn(`Unknown message type from analysis worker: ${type}`);
    }
  };

  worker.onerror = (err) => {
    console.error("An unhandled error occurred in the analysis worker:", err);
    onError(new Error(`An unexpected error occurred in the analysis process: ${err.message}`));
    worker.terminate();
  };
  
  // Send all necessary data for the worker to start its job
  worker.postMessage({
    type: 'start',
    payload: {
      url,
      origin,
      videoID,
      selectedLanguage,
      baseUrl: BASE_URL
    }
  });
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


export const getSlideshowItem = async () => {
  const slideshowUrl = `${BASE_URL}/slideshow-videos`;
  const response = await fetch(slideshowUrl);
  const data = await response.json();
  return data;
};


// export const analyzeVideo = async (url, origin, videoID, selectedLanguage) => {

//   let request_url = `${BASE_URL}/execute`
//   console.log('Calling API at:', request_url)
//   // Debug logging
//   console.log('Request payload:', { url, origin, videoID, selectedLanguage });
//   const response = await fetch(request_url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ url, origin, videoID, selectedLanguage })
//   });
  
//   try { // Wrap in try...catch to handle errors including rate limits

//     // --- Rate Limit Check ---
//     if (response.status === 429) {
//       const rateLimitData = await response.json();
//       // Store rate limit info temporarily for UI feedback
//       sessionStorage.setItem('rateLimitInfo', JSON.stringify({
//         isLimited: true,
//         resetTime: rateLimitData.resetTime,
//         message: rateLimitData.message || 'Rate limit exceeded.' // Use message from API
//       }));
//       // Throw a specific error or return a specific structure
//       throw new Error(rateLimitData.message || 'Rate limit reached'); 
//     }
//     // --- End Rate Limit Check ---

//     if (!response.ok) {
//       // Handle other non-OK responses
//       const errorData = await response.json().catch(() => ({ detail: 'Unknown error processing video' }));
//       throw new Error(errorData.detail || `Error processing video: ${response.statusText}`);
//     }
    
//     // Clear any previous rate limit info on success
//     sessionStorage.removeItem('rateLimitInfo');

//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error("Error in analyzeVideo:", error);
//     // Re-throw the error so the calling component can handle it
//     throw error; 
//   }
// }; 

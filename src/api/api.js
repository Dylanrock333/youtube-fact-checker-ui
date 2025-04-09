import { API_ENDPOINTS } from '../config/constants';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? API_ENDPOINTS.PROD_BASE_URL : API_ENDPOINTS.DEV_LOCAL_URL;

export const analyzeVideo = async (url, origin, videoID) => {

  let request_url = `${BASE_URL}/execute`
  console.log('Calling API at:', request_url)
  const response = await fetch(request_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, origin, videoID })
  });

  if (!response.ok) {
    throw new Error('Error processing video');
  }

  const data = await response.json();
  return data;
    
}; 

export const checkApiHealth = async () => {
  try {
    //TODO: Have a better way for production and development environment
    const isDev = process.env.NODE_ENV === 'development';
    const healthUrl = `${isDev ? API_ENDPOINTS.DEV_LOCAL_URL : API_ENDPOINTS.PROD_BASE_URL}${API_ENDPOINTS.HEALTH_CHECK}`;
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error performing deep search:', error);
    return `Error performing deep search: ${error.message}`;
  }
};    

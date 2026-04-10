<!-- Production configuration for ZEDU Frontend -->
<!-- Add this to your HTML headers or use environment variables -->

<!-- 
For Render Deployment:

Frontend URL: https://zedu-frontend.onrender.com
Backend API: https://zedu-backend.onrender.com/api

Update the API client configuration in js/api-client.js to detect environment:

const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env.API_URL) {
    return process.env.API_URL;
  }
  
  // Production (Render)
  if (window.location.hostname.includes('onrender.com')) {
    return 'https://zedu-backend.onrender.com/api';
  }
  
  // Development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Fallback
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();
-->

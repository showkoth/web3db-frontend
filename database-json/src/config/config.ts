// Configuration settings for the application
export const config = {
  // Backend API base URL - uses environment variable with fallback
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://129.74.154.215:8000',
  
  // API endpoints
  ENDPOINTS: {
    QUERY: '/query',
    SCHEMAS: '/schemas',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`;
};

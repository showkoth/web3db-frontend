// Configuration settings for the application
export const config = {
  // Backend API base URL - uses environment variable with fallback
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://129.74.154.215:8000',
  
  // Default wallet address for fallback when user wallet is not connected
  DEFAULT_WALLET_ADDRESS: process.env.REACT_APP_DEFAULT_WALLET_ADDRESS || '0x1A28b19f6d2ea1A05F9eFFbcCcbF7E9571877981',
  
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

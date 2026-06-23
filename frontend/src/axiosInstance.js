import axios from 'axios';

// In production, VITE_API_URL should point to the deployed backend URL.
// In development, empty baseURL lets Vite proxy handle /api/* requests.
const baseURL = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD) {
  if (!baseURL) {
    console.error(
      'CRITICAL: VITE_API_URL environment variable is not set. API requests will fail in production.\n' +
      'Set VITE_API_URL in Vercel to your Render backend URL, e.g., https://my-backend.onrender.com'
    );
  } else {
    console.log(`API configured for: ${baseURL}`);
  }
}

const instance = axios.create({
  baseURL: baseURL || '',
  withCredentials: true,
});

// Attach JWT from localStorage as Authorization header on every request.
// This is a reliable cross-domain fallback because browsers often block
// cross-site cookies (Vercel frontend -> Render backend), even with SameSite=None.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add error interceptor for better debugging
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 0 || error.code === 'ERR_NETWORK') {
      console.error(
        'Network error: Backend is unreachable.\n' +
        `Attempting to reach: ${baseURL || 'current host'}\n` +
        'Verify VITE_API_URL is set correctly and backend is running.'
      );
    }
    return Promise.reject(error);
  }
);

export default instance;

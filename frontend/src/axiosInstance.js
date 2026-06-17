import axios from 'axios';

// In production, VITE_API_URL should point to the deployed backend URL.
// In development, Vite proxy will handle /api/* requests locally.
const baseURL = import.meta.env.VITE_API_URL || '';

if (import.meta.env.PROD && !baseURL) {
  console.warn(
    'VITE_API_URL is not set. Production frontend requests will be sent to the current host and may fail if the backend is deployed separately.'
  );
}

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;

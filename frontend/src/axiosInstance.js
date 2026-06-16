import axios from 'axios';

// In production (Vercel), VITE_API_URL points to the Render backend.
// In development, it's empty so Vite's proxy handles /api/* calls.
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

export default instance;

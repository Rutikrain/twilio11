// Base API URL configuration
// In production (Vercel), set VITE_API_URL to your deployed backend URL.
// Fallback is http://localhost:5000/api for local development.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_BASE_URL;

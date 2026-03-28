// Base API URL configuration
// Use local backend for development to bypass Render issues, and Render for Vercel
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://twilio11-1.onrender.com/api';

export default API_BASE_URL;

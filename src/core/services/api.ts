import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

api.defaults.withCredentials = true;

// Request interceptor: Attach token
api.interceptors.request.use(
  async config => {
    return config;
  },
  error => Promise.reject(error)
);
export default api;

import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});

// --- Senior Dev Pattern: Request Interceptor (Automatic Token Injection) ---
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Senior Dev Pattern: Response Interceptor (Standardized Error Handling) ---
axiosInstance.interceptors.response.use(
  (response) => {
    // Normalizing the response: return only the data expected by TanStack Query
    // Current backend returns { success: true, data: ..., message: ... }
    return response.data;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Unidentified Protocol Breach)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Global Logout Trigger if session is definitively dead
      store.dispatch(logout());
      
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=true";
      }
    }

    // Standardize error structure for TanStack Query
    const message = error.response?.data?.message || "--- System Registry Access Failure ---";
    const status = error.response?.status || 500;

    const customError = new Error(message);
    customError.status = status;
    customError.data = error.response?.data;

    return Promise.reject(customError);
  }
);

export default axiosInstance;

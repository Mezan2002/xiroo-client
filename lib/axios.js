import { logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import axios from "axios";
import { getFromStorage, SECURITY_KEYS } from "@/lib/storage";

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
    // 1. Primary Source: Synchronous Redux Provider
    const state = store.getState();
    let token = state.auth?.token;

    // 2. Fallback Source: Direct LocalStorage (Fixes race conditions during hydration/callback)
    if (!token && typeof window !== "undefined") {
      token = getFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
    }

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
      
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      
      // Define Protected Regions (Only logout/redirect in these zones)
      const protectedPaths = ["/account", "/admin"];
      const isProtected = protectedPaths.some(path => pathname.startsWith(path));
      
      // Global Logout Trigger: Only for protected routes or if explicitly required
      if (isProtected) {
        store.dispatch(logout());
        
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=true";
        }
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

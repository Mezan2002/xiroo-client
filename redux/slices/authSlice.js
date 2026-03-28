"use client";

import { createSlice } from "@reduxjs/toolkit";
import { getFromStorage, saveToStorage, removeFromStorage, SECURITY_KEYS } from "@/lib/storage";

const getInitialAuthContent = () => {
  if (typeof window === "undefined") return { token: null, isAuthenticated: false };
  const token = getFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
  return {
    token,
    isAuthenticated: !!token,
  };
};

const initialState = {
  ...getInitialAuthContent(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      
      // Persist only the token (Session Identity)
      saveToStorage(SECURITY_KEYS.ACCESS_TOKEN, token);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear session from storage
      removeFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
      removeFromStorage(SECURITY_KEYS.USER_DATA);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    hydrate: (state) => {
      const token = getFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setCredentials, logout, setLoading, hydrate } = authSlice.actions;
export default authSlice.reducer;

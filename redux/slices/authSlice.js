"use client";

import { createSlice } from "@reduxjs/toolkit";
import { getFromStorage, saveToStorage, removeFromStorage, SECURITY_KEYS } from "@/lib/storage";

const getInitialAuthContent = () => {
  if (typeof window === "undefined") return { user: null, token: null, isAuthenticated: false };
  const user = getFromStorage(SECURITY_KEYS.USER_DATA);
  const token = getFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
  return {
    user,
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
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Persist to Encrypted LocalStorage
      saveToStorage(SECURITY_KEYS.USER_DATA, user);
      saveToStorage(SECURITY_KEYS.ACCESS_TOKEN, token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear from Encrypted LocalStorage
      removeFromStorage(SECURITY_KEYS.USER_DATA);
      removeFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      saveToStorage(SECURITY_KEYS.USER_DATA, action.payload);
    },
    hydrate: (state) => {
      const user = getFromStorage(SECURITY_KEYS.USER_DATA);
      const token = getFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
      
      if (token) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setCredentials, logout, setLoading, updateUser, hydrate } = authSlice.actions;
export default authSlice.reducer;

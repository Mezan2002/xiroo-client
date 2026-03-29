"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import toastReducer from "./slices/toastSlice";
import notificationReducer from "./slices/notificationSlice";
import layoutReducer from "./slices/layoutSlice";
import recentlyViewedReducer from "./slices/recentlyViewedSlice";
import { persistenceMiddleware } from "./middleware/persistenceMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    toast: toastReducer,
    notifications: notificationReducer,
    layout: layoutReducer,
    recentlyViewed: recentlyViewedReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistenceMiddleware),
});

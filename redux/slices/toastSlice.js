import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { message, type = "success", duration = 4000 } = action.payload;
      const id = Math.random().toString(36).substring(2, 9);
      state.toasts.push({ id, message, type, duration });
    },
    removeToast: (state, action) => {
      const id = action.payload;
      state.toasts = state.toasts.filter((t) => t.id !== id);
    },
  },
});

// Helper for more intuitive dispatching
export const toastActions = {
  success: (message, duration) => addToast({ message, type: "success", duration }),
  error: (message, duration) => addToast({ message, type: "error", duration }),
  info: (message, duration) => addToast({ message, type: "info", duration }),
};

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageSrc: "/images/auth/login.png",
  heading: "",
  description: "",
  badgeText: "",
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    updateAuthLayout: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetAuthLayout: (state) => {
      return initialState;
    },
  },
});

export const { updateAuthLayout, resetAuthLayout } = layoutSlice.actions;
export default layoutSlice.reducer;

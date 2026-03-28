import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    toggleItem: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((i) => (i._id === product._id || i.id === product.id));
      
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          ...product,
          addedAt: new Date().toISOString(),
        });
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { setWishlist, toggleItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

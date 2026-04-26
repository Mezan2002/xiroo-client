import { createSlice } from "@reduxjs/toolkit";

const MAX_RECENT_ITEMS = 10;

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: {
    items: [],
  },
  reducers: {
    /**
     * Adds a product to the recently viewed list.
     * - Removes duplicates (keeps item at top if re-viewed)
     * - Prunes list to MAX_RECENT_ITEMS
     */
    addRecentView: (state, action) => {
      const incoming = action.payload;
      // Remove any existing entry of the same product
      const filtered = state.items.filter((item) => item._id !== incoming._id);
      // Prepend the new item at the top
      state.items = [incoming, ...filtered].slice(0, MAX_RECENT_ITEMS);
    },
    setRecentlyViewed: (state, action) => {
      state.items = action.payload;
    },
    clearRecentViews: (state) => {
      state.items = [];
    },
  },
});

export const { addRecentView, setRecentlyViewed, clearRecentViews } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;

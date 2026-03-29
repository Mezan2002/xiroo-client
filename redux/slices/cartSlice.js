import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      const metrics = calculateMetrics(state.items);
      state.subtotal = metrics.subtotal;
      state.itemCount = metrics.itemCount;
    },
    addToCart: (state, action) => {
      const { product, variant } = action.payload;
      const incomingId = product._id || product.id;

      const existingItemIndex = state.items.findIndex(
        (item) =>
          (item._id === incomingId || item.id === incomingId) &&
          item.variant === variant
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += 1;
      } else {
        // Normalize the item by ensuring it has the ID we expect for future lookups
        state.items.push({
          ...product,
          _id: incomingId, // Store under _id for consistent grouping
          variant,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }
      
      const metrics = calculateMetrics(state.items);
      state.subtotal = metrics.subtotal;
      state.itemCount = metrics.itemCount;
    },
    updateQuantity: (state, action) => {
      const { id, variant, delta } = action.payload;
      const item = state.items.find((i) => (i._id === id || i.id === id) && i.variant === variant);
      if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
      }
      
      const metrics = calculateMetrics(state.items);
      state.subtotal = metrics.subtotal;
      state.itemCount = metrics.itemCount;
    },
    removeFromCart: (state, action) => {
      const { id, variant } = action.payload;
      state.items = state.items.filter(
        (i) => !((i._id === id || i.id === id) && i.variant === variant)
      );
      
      const metrics = calculateMetrics(state.items);
      state.subtotal = metrics.subtotal;
      state.itemCount = metrics.itemCount;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
    },
  },
});

const calculateMetrics = (items) => {
  const subtotal = items.reduce((sum, item) => {
    const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    const numericPrice = parseFloat(activePrice?.toString().replace(/[^0-9.]/g, "") || 0);
    return sum + numericPrice * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, itemCount };
};

export const { setCart, addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

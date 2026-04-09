import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  discount: null,
  discountAmount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
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
      
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
    },
    updateQuantity: (state, action) => {
      const { id, variant, delta } = action.payload;
      const item = state.items.find((i) => (i._id === id || i.id === id) && i.variant === variant);
      if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
      }
      
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
    },
    removeFromCart: (state, action) => {
      const { id, variant } = action.payload;
      state.items = state.items.filter(
        (i) => !((i._id === id || i.id === id) && i.variant === variant)
      );
      
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
      state.discount = null;
      state.discountAmount = 0;
      state.total = 0;
    },
    applyDiscount: (state, action) => {
      state.discount = action.payload;
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
    },
    removeDiscount: (state) => {
      state.discount = null;
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
    },
  },
});

const calculateMetrics = (items, discount = null) => {
  const subtotal = items.reduce((sum, item) => {
    const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    const numericPrice = parseFloat(activePrice?.toString().replace(/[^0-9.]/g, "") || 0);
    return sum + numericPrice * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (discount) {
    if (discount.type === "percentage") {
      discountAmount = subtotal * (discount.value / 100);
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }
  }
  
  discountAmount = Math.min(discountAmount, subtotal);
  const total = subtotal - discountAmount;

  return { subtotal, itemCount, discountAmount, total };
};

export const { setCart, addToCart, updateQuantity, removeFromCart, clearCart, applyDiscount, removeDiscount } = cartSlice.actions;
export default cartSlice.reducer;

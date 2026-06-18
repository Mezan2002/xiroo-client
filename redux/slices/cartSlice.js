import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  discount: null,
  discountAmount: 0,
  autoBundleDiscountAmount: 0,
  isBundleFreeShipping: false,
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
      const { product, variant, quantity = 1, bundleId } = action.payload;
      const incomingId = product._id || product.id;

      const existingItemIndex = state.items.findIndex(
        (item) =>
          (item._id === incomingId || item.id === incomingId) &&
          item.variant === variant &&
          item.bundleId === bundleId
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Normalize the item by ensuring it has the ID we expect for future lookups
        state.items.push({
          ...product,
          _id: incomingId, // Store under _id for consistent grouping
          variant,
          quantity,
          bundleId, // Link to an explicit bundle session if applicable
          addedAt: new Date().toISOString(),
        });
      }
      
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
    },
    updateQuantity: (state, action) => {
      const { id, variant, delta, bundleId } = action.payload;
      const item = state.items.find((i) => (i._id === id || i.id === id) && i.variant === variant && i.bundleId === bundleId);
      if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
      }
      
      const metrics = calculateMetrics(state.items, state.discount);
      Object.assign(state, metrics);
    },
    removeFromCart: (state, action) => {
      const { id, variant, bundleId } = action.payload;
      state.items = state.items.filter(
        (i) => !((i._id === id || i.id === id) && i.variant === variant && i.bundleId === bundleId)
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
      state.autoBundleDiscountAmount = 0;
      state.isBundleFreeShipping = false;
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
  let subtotal = 0;
  let itemCount = 0;
  const bundleGroups = {};

  items.forEach((item) => {
    const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    const numericPrice = parseFloat(activePrice?.toString().replace(/[^0-9.]/g, "") || 0);
    const itemSubtotal = numericPrice * item.quantity;
    
    subtotal += itemSubtotal;
    itemCount += item.quantity;

    if (item.bundleId) {
      if (!bundleGroups[item.bundleId]) {
        bundleGroups[item.bundleId] = {
          quantity: 0,
          subtotal: 0
        };
      }
      bundleGroups[item.bundleId].quantity += item.quantity;
      bundleGroups[item.bundleId].subtotal += itemSubtotal;
    }
  });

  let autoBundleDiscountAmount = 0;
  let isBundleFreeShipping = false;

  Object.values(bundleGroups).forEach((group) => {
    if (group.quantity >= 2) {
      autoBundleDiscountAmount += group.subtotal * 0.10;
    }
    if (group.quantity >= 3) {
      isBundleFreeShipping = true;
    }
  });

  let discountAmount = 0;
  if (discount) {
    if (discount.type === "percentage") {
      discountAmount = subtotal * (discount.value / 100);
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }
  }
  
  const totalDiscounts = discountAmount + autoBundleDiscountAmount;
  const appliedDiscountAmount = Math.min(totalDiscounts, subtotal);
  const total = subtotal - appliedDiscountAmount;

  return { 
    subtotal, 
    itemCount, 
    discountAmount, 
    autoBundleDiscountAmount,
    isBundleFreeShipping,
    total 
  };
};

export const { setCart, addToCart, updateQuantity, removeFromCart, clearCart, applyDiscount, removeDiscount } = cartSlice.actions;
export default cartSlice.reducer;

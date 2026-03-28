import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
      // Limit to 50
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },
    markRead: (state, action) => {
      const id = action.payload;
      const notif = state.notifications.find((n) => n._id === id);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
  },
});

export const { 
  setNotifications, 
  setUnreadCount, 
  addNotification, 
  markRead, 
  markAllRead 
} = notificationSlice.actions;

export default notificationSlice.reducer;

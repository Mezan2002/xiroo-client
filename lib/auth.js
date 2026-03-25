import { saveToStorage, getFromStorage, removeFromStorage, SECURITY_KEYS } from "./storage";

export const setToken = (token) => {
  saveToStorage(SECURITY_KEYS.ACCESS_TOKEN, token);
};

export const getToken = () => {
  return getFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
};

export const removeToken = () => {
  removeFromStorage(SECURITY_KEYS.ACCESS_TOKEN);
};

import { getFromStorage, SECURITY_KEYS } from "./storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiRequest = async (endpoint, options = {}) => {
  const token = getFromStorage(SECURITY_KEYS.ACCESS_TOKEN);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || '--- Protocol Registry Error ---');
    error.code = data.code;
    throw error;
  }

  return data;
};

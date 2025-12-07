// App constants

export const APP_NAME = 'Handla';

export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || '',
  TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@handla/auth_token',
  USER_PREFERENCES: '@handla/user_preferences',
};

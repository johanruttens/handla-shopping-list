// API client configuration
// Configure your HTTP client here (fetch, axios, etc.)

import { API } from '../../constants';

export const apiClient = {
  baseUrl: API.BASE_URL,
  timeout: API.TIMEOUT,
};

export default apiClient;

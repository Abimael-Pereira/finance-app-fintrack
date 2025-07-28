import axios from 'axios';

import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/constants/local-storege';

export const protectedApi = axios.create({
  baseURL: import.meta.env.VITE_protectedApi_URL || 'http://localhost:8080/api',
});

export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_protectedApi_URL || 'http://localhost:8080/api',
});

protectedApi.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return request;
  }

  request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
});

protectedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !request._retry &&
      !request.url.includes('/auth/refresh-token')
    ) {
      request._retry = true;
      try {
        const response = await protectedApi.post('/auth/refresh-token', {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, newAccessToken);
        localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);

        request.headers.Authorization = `Bearer ${newAccessToken}`;
        return protectedApi(request);
      } catch (error) {
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
        console.log(error);
      }
    }

    console.log('Passou do try');

    return Promise.reject(error);
  }
);

import axios from 'axios';

import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from '@/constants/local-storege';

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

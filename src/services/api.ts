import axios from 'axios';
import { router } from 'expo-router';
import useAuthStore from '../store/authStore';
import { isAccessTokenExpired } from '../utils/jwt';

const api = axios.create({
  baseURL: 'https://bolaofc-backend.vercel.app',
});

api.interceptors.request.use(async (config) => {
  const { accessToken, user, logout } = useAuthStore.getState();
  if (user && accessToken && isAccessTokenExpired(accessToken)) {
    await logout();
    router.replace('/(auth)/login');
    return Promise.reject(new Error('Sessão expirada. Faça login novamente.'));
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export default api;
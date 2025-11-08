import axios from 'axios';
import useAppStore from './store';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const instance = axios.create({
  baseURL: `${apiBase}/api`,
  withCredentials: false
});

instance.interceptors.request.use((config) => {
  const token = useAppStore.getState().auth.token;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});

instance.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const message = error.response?.data?.message || error.message;
    useAppStore.getState().toast.show({ title: '请求失败', description: message });
    return Promise.reject(error);
  }
);

export async function fetchJSON<T>(url: string, options?: { method?: string; data?: unknown }) {
  const response = await instance.request<T>({
    url,
    method: options?.method || 'GET',
    data: options?.data
  });
  return response.data;
}

export default instance;

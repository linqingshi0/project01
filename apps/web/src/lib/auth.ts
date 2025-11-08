import { fetchJSON } from './api';
import useAppStore from './store';

export interface LoginPayload {
  email: string;
  name?: string;
}

export async function login(payload: LoginPayload) {
  const data = await fetchJSON<{ token: string; user: any }>('auth/login', {
    method: 'POST',
    data: payload
  });
  useAppStore.getState().auth.setUser(data.user, data.token);
  return data;
}

export function logout() {
  useAppStore.getState().auth.reset();
}

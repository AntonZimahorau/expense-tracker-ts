import { api } from './axios';
import { setAccessToken } from './token';

export async function loginUser(email: string, password: string) {
  const res = await api.post('/auth/sign-in', { email, password });
  const token: string = res.data.access_token;
  return token;
}

export async function signUpUser(
  name: string,
  email: string,
  password: string,
) {
  const res = await api.post('/auth/sign-up', { name, email, password });
  const message: string = res.data.message;
  return message;
}

export async function bootstrapAuth() {
  try {
    const { data } = await api.post('/auth/refresh');
    setAccessToken(data.access_token);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}

export async function logoutUser() {
  await api.post('/auth/logout');
}

export async function forgotPassword(email: string) {
  const res = await api.post('/auth/forgot-password', { email });
  const message: string = res.data.message;
  return message;
}

export async function restorePassword(email: string, password: string) {
  const res = await api.post('/auth/restore-password', { email, password });
  const message: string = res.data.message;
  return message;
}

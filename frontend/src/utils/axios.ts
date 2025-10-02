import axios, { AxiosError } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './token';

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8079/api';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const plain = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

async function ensureToken() {
  if (getAccessToken()) return getAccessToken()!;
  if (!refreshPromise) {
    refreshPromise = plain
      .post('/auth/refresh')
      .then(({ data }) => {
        setAccessToken(data.access_token);
        return data.access_token as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  const token = getAccessToken() || (await ensureToken());
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as any;
    const status = err.response?.status;

    if (status !== 401 || original?._retry) {
      return Promise.reject(err);
    }

    original._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        const { data } = await plain.post('/auth/refresh');
        const newToken: string = data.access_token;
        setAccessToken(newToken);

        queue.forEach((go) => go(newToken));
        queue = [];
      }

      return new Promise((resolve) => {
        queue.push((token: string) => {
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    } catch (e) {
      queue = [];
      clearAccessToken();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

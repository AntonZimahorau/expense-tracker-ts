import * as Sentry from '@sentry/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { bootstrapAuth, loginUser, logoutUser } from '../utils/auth';
import {
  setAccessToken,
  clearAccessToken,
  getAccessToken,
} from '../utils/token';

type AuthCtx = {
  ready: boolean;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthed, setAuthed] = useState(!!getAccessToken());

  useEffect(() => {
    (async () => {
      await bootstrapAuth();
      setAuthed(!!getAccessToken());
      setReady(true);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const token = await loginUser(email, password);
      setAccessToken(token);
      setAuthed(true);
    } catch (e) {
      Sentry.captureException(e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      Sentry.captureException(e);
    }
    clearAccessToken();
    setAuthed(false);
  };

  return (
    <Ctx.Provider value={{ ready, isAuthed, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

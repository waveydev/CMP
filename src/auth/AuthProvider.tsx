import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

type User = {
  id: string;
  email: string;
  role: 'NATIONAL' | 'REGIONAL';
  region?: string | null;
};

type LoginInput = { email: string; password: string };

type RedeemInviteInput = { token: string; email: string; password: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (input: LoginInput) => Promise<void>;
  redeemInvite: (input: RedeemInviteInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (stored) {
        setToken(stored);
        try {
          const profile = await api.me(stored);
          setUser(profile);
        } catch {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      }
    })();
  }, []);

  const login = async (input: LoginInput) => {
    const res = await api.login(input);
    await SecureStore.setItemAsync(TOKEN_KEY, res.token, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
    setToken(res.token);
    setUser(res.user);
  };

  const redeemInvite = async (input: RedeemInviteInput) => {
    await api.redeemInvite(input);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, redeemInvite, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

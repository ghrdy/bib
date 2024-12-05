import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'referent' | 'simple';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
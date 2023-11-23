// src/store/authActions.ts
import { User } from '@supabase/supabase-js';

export const setUser = (user: User) => ({
  type: 'SET_USER' as const,
  payload: user,
});

export const clearUser = () => ({
  type: 'CLEAR_USER' as const,
});

export type AuthAction = ReturnType<typeof setUser | typeof clearUser>;

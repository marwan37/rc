// src/store/authReducer.ts
import { AuthAction } from './authActions';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    default:
      return state;
  }
};

export default authReducer;

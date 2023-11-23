// src/components/Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '@/utils/supabase';
import { setUser } from '@/store/auth/authActions';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await (supabase.auth as any).signIn({ email, password });

    if (response.error) {
      alert(response.error.message);
    } else if (response.data && response.data.user) {
      dispatch(setUser(response.data.user));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
      <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;

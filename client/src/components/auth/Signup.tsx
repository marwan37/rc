// src/components/auth.Signup.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '@/utils/supabase';
import { setUser } from '@/store/auth/authActions';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await supabase.auth.signUp({ email, password });

    if (response.error) {
      alert(response.error.message);
    } else if (response.data && response.data.user) {
      dispatch(setUser(response.data.user));
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
      <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
      <button type='submit'>Sign Up</button>
    </form>
  );
};

export default Signup;

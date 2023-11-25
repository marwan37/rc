import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from './utils/supabase';
import { clearUser, setUser } from './store/auth/authActions';
import { Session } from '@supabase/supabase-js';
import AuthStyles from './AuthStyles.module.css';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import AuthPage from './pages/AuthPage';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(clearUser());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/login'
            element={<AuthPage session={session} redirectTo={window.location.origin + '/login'} />}
          />
          <Route
            path='/signup'
            element={<AuthPage session={session} redirectTo={window.location.origin + '/signup'} />}
          />

          <Route path='/demo' element={<DemoPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from './utils/supabase';
import { clearUser, setUser } from './store/auth/authActions';
import { Session } from '@supabase/supabase-js';

// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';

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

  // const AuthPage = () =>
  //   !session ? <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} /> : <div>Logged in!</div>;

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/demo' element={<DemoPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

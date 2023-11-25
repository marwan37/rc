import AuthStyles from '@components/auth/Auth.module.css';
import { supabase } from '@utils/supabase';
import { Session } from '@supabase/supabase-js';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

interface AuthPageProps {
  session: Session | null;
  redirectTo: string;
}

const AuthPage = ({ session, redirectTo }: AuthPageProps) => (
  <div className={AuthStyles.AuthPage}>
    <div className={AuthStyles.AuthHeader}>
      <div className={AuthStyles.AuthHeaderLogo}>RocketChat</div>
    </div>
    <div className={AuthStyles.AuthBody}>
      <div className={AuthStyles.AuthForm}>
        {!session ? (
          <Auth
            magicLink={true}
            supabaseClient={supabase}
            view='sign_in'
            appearance={{ theme: ThemeSupa }}
            redirectTo={redirectTo}
            providers={['google', 'github']}
          />
        ) : (
          <div>Logged In</div>
        )}
      </div>
    </div>
    <div className={AuthStyles.AuthFooter}>{/* <HelperMessage>Powered by Matrix</HelperMessage> */}</div>
  </div>
);
export default AuthPage;

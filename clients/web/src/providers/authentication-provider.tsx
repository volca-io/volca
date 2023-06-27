import React, { useContext, useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { createContext } from 'react';
import _ from 'lodash';
import { Sentry } from '@sentry/react'
import { v4 as uuid } from 'uuid';
import { LoadingPage } from '../pages';
import { User } from '../types';
import { useUserActions } from '../hooks';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLoadingContext } from './loading-provider';
import { useToast } from '@chakra-ui/react';
import { useAppConfigContext } from './app-config-provider';

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type ConfirmSignUpProps = {
  email: string;
  code: string;
};

type ResendSignUpProps = {
  email: string;
};

type ResetPasswordProps = {
  email: string;
};

type CompleteResetPasswordProps = {
  email: string;
  code: string;
  password: string;
};

interface AuthenticationProviderProps {
  openHostedUI: () => Promise<void>;
  signInWithEmailAndPassword: (props: SignInProps) => Promise<void>;
  signUpWithEmailAndPassword: (props: SignUpProps) => Promise<void>;
  resendSignUp: (props: ResendSignUpProps) => Promise<void>;
  confirmSignUp: (props: ConfirmSignUpProps) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (props: ResetPasswordProps) => Promise<void>;
  completeResetPassword: (props: CompleteResetPasswordProps) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthenticationProviderProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setinitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { config } = useAppConfigContext();
  const { provision } = useUserActions();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoadingContext();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const hasActiveSession = async () => {
    if (config.mockTokens) return true;

    try {
      await Auth.currentSession();
      return true;
    } catch (err: unknown) {
      return false;
    }
  };

  const handleSignIn = _.debounce(async () => {
    const hasSession = await hasActiveSession();
    if (hasSession) {
      const idToken = config.mockTokens
        ? config.mockTokens.idToken
        : (await Auth.currentSession()).getIdToken().getJwtToken();
      const res = await provision({ idToken });
      if (res) {
        setUser(res);
      }
    }

    setinitialized(true);
  }, 250); // Debounce function to prevent double trigger on social sign in and page load

  const onLoad = async () => {
    await handleSignIn();
  };

  useEffect(() => {
    let unsubscribe = () => {};

    if (!config.mockTokens) {
      Amplify.configure({
        Auth: {
          userPoolId: config.awsCognitoUserpoolId,
          region: config.aws_region,
          userPoolWebClientId: config.awsCognitoAppClientId,
          oauth: {
            domain: config.awsCognitoLoginDomain,
            redirectSignIn: `${window.location.protocol}//${window.location.host}`,
            redirectSignOut: `${window.location.protocol}//${window.location.host}`,
            responseType: 'code',
          },
        },
      });

      unsubscribe = Hub.listen('auth', async ({ payload: { event, data } }) => {
        switch (event) {
          case 'signIn':
            await handleSignIn();

            break;
          case 'signOut':
            setUser(null);
            break;
          case 'customOAuthState':
            const customState = readCustomState(data);
            if (customState && customState.continue) {
              navigate(customState.continue);
            }
            break;
        }
      });
    }

    onLoad();

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (process.env.REACT_APP_SENTRY_DSN) {
      if (user) {
        Sentry.setUser({ id: user.id, email: user.email });
      } else {
        Sentry.setUser(null);
      }
    }
  }, [user]);

  const storeCustomState = () => {
    const key = uuid();
    const continueParam = searchParams.get('continue');
    sessionStorage.setItem(key, JSON.stringify({ continue: continueParam }));

    return key;
  };

  const readCustomState = (key: string) => {
    const customState = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    return customState ? JSON.parse(customState) : null;
  };

  const openHostedUI = async () => {
    try {
      setLoading(true);
      await Auth.federatedSignIn();
    } catch (err: any) {
      toast({
        title: 'Failed to start login',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailAndPassword = async ({ email, password }: SignInProps) => {
    try {
      setLoading(true);
      await Auth.signIn({ username: email, password });
    } catch (err: any) {
      if (err.code === 'UserNotConfirmedException') {
        navigate(
          {
            pathname: '/sign-up/confirm',
            search: location.search,
          },
          {
            state: {
              email,
            },
          }
        );
      }
      toast({
        title: 'Sign in failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmailAndPassword = async ({ email, password, firstName, lastName }: SignUpProps) => {
    try {
      setLoading(true);
      const res = await Auth.signUp({
        username: email,
        password,
        attributes: { given_name: firstName, family_name: lastName, email },
        autoSignIn: { enabled: true },
      });

      if (!res.userConfirmed) {
        navigate(
          {
            pathname: '/sign-up/confirm',
            search: location.search,
          },
          {
            state: {
              email,
            },
          }
        );
      }
    } catch (err: any) {
      toast({
        title: 'Sign up failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ email }: ResetPasswordProps) => {
    try {
      setLoading(true);
      await Auth.forgotPassword(email);
      toast({
        title: 'Success',
        description: 'Instructions has been sent to your email',
        status: 'success',
      });
      navigate(
        {
          pathname: '/reset-password/verify',
          search: location.search,
        },
        {
          state: {
            email,
          },
        }
      );
    } catch (err: any) {
      toast({
        title: 'Failed to reset password',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const completeResetPassword = async ({ email, code, password }: CompleteResetPasswordProps) => {
    try {
      setLoading(true);
      await Auth.forgotPasswordSubmit(email, code, password);
      toast({
        title: 'Success',
        description: 'Your password has been reset',
        status: 'success',
      });
      navigate({
        pathname: '/sign-in',
        search: location.search,
      });
    } catch (err: any) {
      toast({
        title: 'Failed to reset password',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async ({ email, code }: ConfirmSignUpProps) => {
    try {
      setLoading(true);
      await Auth.confirmSignUp(email, code);
    } catch (err: any) {
      toast({
        title: 'Verification failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const resendSignUp = async ({ email }: ResendSignUpProps) => {
    try {
      setLoading(true);
      await Auth.resendSignUp(email);
    } catch (err: any) {
      toast({
        title: 'Verification failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google, customState: storeCustomState() });
    } catch (err: any) {
      toast({
        title: 'Sign in failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook, customState: storeCustomState() });
    } catch (err: any) {
      toast({
        title: 'Sign in failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Apple, customState: storeCustomState() });
    } catch (err: any) {
      toast({
        title: 'Sign in failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await Auth.signOut();
    } catch (err: any) {
      toast({
        title: 'Sign out failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        openHostedUI,
        signInWithEmailAndPassword,
        signUpWithEmailAndPassword,
        confirmSignUp,
        resendSignUp,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        signOut,
        resetPassword,
        completeResetPassword,
        user,
      }}
    >
      {initialized ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthenticationProviderProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Failed to load auth context. Make sure you are consuming the context within a provider block');
  }

  return context;
};

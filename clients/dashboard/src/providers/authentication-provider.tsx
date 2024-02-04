import React, { useContext, useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { createContext } from 'react';
import * as Sentry from '@sentry/react';
import { v4 as uuid } from 'uuid';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingPage } from '../pages';
import { User } from '../types';
import { useAppConfigContext } from './app-config-provider';
import { useApiClient } from '../hooks/api-actions';

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

type SignInMode = 'signIn' | 'signUp';

interface AuthenticationProviderProps {
  openHostedUI: () => Promise<void>;
  signInWithEmailAndPassword: (props: SignInProps) => Promise<void>;
  signUpWithEmailAndPassword: (props: SignUpProps) => Promise<void>;
  resendSignUp: (props: ResendSignUpProps) => Promise<void>;
  confirmSignUp: (props: ConfirmSignUpProps) => Promise<void>;
  signInWithGoogle: (mode: SignInMode) => Promise<void>;
  signInWithFacebook: (mode: SignInMode) => Promise<void>;
  signInWithApple: (mode: SignInMode) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (props: ResetPasswordProps) => Promise<void>;
  completeResetPassword: (props: CompleteResetPasswordProps) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthenticationProviderProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setinitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { config } = useAppConfigContext();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const { publicClient } = useApiClient();

  const provision = useMutation({
    mutationFn: async (idToken: string) => {
      const { me } = await publicClient.post('users/provision', { json: { idToken } }).json<{ me: User }>();
      return me;
    },
  });

  const hasActiveSession = async () => {
    if (config.mockTokens) return true;

    try {
      await Auth.currentSession();
      return true;
    } catch (err: unknown) {
      return false;
    }
  };

  const handleSignIn = async () => {
    const hasSession = await hasActiveSession();
    if (hasSession) {
      const idToken = config.mockTokens
        ? config.mockTokens.idToken
        : (await Auth.currentSession()).getIdToken().getJwtToken();

      const res = await provision.mutateAsync(idToken);

      if (res) {
        setUser(res);
      }
    }

    setinitialized(true);
  };

  const navigateContinue = (defaultPath?: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    const continueTo = searchParams.get('continue') || defaultPath;

    if (continueTo) {
      navigate(continueTo);
    }
  };

  const onLoad = async () => {
    await handleSignIn();
    navigateContinue();
  };

  const onSignIn = async () => {
    await handleSignIn();
    navigateContinue('/projects');
  };

  useEffect(() => {
    let unsubscribe = () => {};

    if (!config.mockTokens) {
      unsubscribe = Hub.listen('auth', async ({ payload: { event, data } }) => {
        switch (event) {
          case 'signIn':
            await onSignIn();
            break;
          case 'signOut':
            setUser(null);
            break;
          case 'customOAuthState': {
            const customState = readCustomState(data);
            if (customState && customState.continue) {
              navigate(customState.continue);
            }
            break;
          }
        }
      });
    }

    onLoad();

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_SENTRY_DSN) {
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

  const isRecord = (obj: unknown): obj is Record<string, unknown> => typeof obj === 'object';
  const isError = (obj: unknown): obj is Error => obj instanceof Error;

  const readCustomState = (key: string) => {
    const customState = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    return customState ? JSON.parse(customState) : null;
  };

  const openHostedUI = async () => {
    try {
      await Auth.federatedSignIn();
    } catch (err: unknown) {
      toast({
        title: 'Failed to start login',
        description: err instanceof Error ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const signInWithEmailAndPassword = async ({ email, password }: SignInProps) => {
    try {
      await Auth.signIn({ username: email, password });
    } catch (err: unknown) {
      if (isRecord(err) && err.code === 'UserNotConfirmedException') {
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
        description: err instanceof Error ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const signUpWithEmailAndPassword = async ({ email, password, firstName, lastName }: SignUpProps) => {
    try {
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
    } catch (err: unknown) {
      toast({
        title: 'Sign up failed',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const resetPassword = async ({ email }: ResetPasswordProps) => {
    try {
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
    } catch (err: unknown) {
      toast({
        title: 'Failed to reset password',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const completeResetPassword = async ({ email, code, password }: CompleteResetPasswordProps) => {
    try {
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
    } catch (err: unknown) {
      toast({
        title: 'Failed to reset password',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const confirmSignUp = async ({ email, code }: ConfirmSignUpProps) => {
    await Auth.confirmSignUp(email, code);
  };

  const resendSignUp = async ({ email }: ResendSignUpProps) => {
    try {
      await Auth.resendSignUp(email);
    } catch (err: unknown) {
      toast({
        title: 'Verification failed',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google, customState: storeCustomState() });
    } catch (err: unknown) {
      toast({
        title: 'Sign in failed',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const signInWithFacebook = async () => {
    try {
      await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Facebook,
        customState: storeCustomState(),
      });
    } catch (err: unknown) {
      toast({
        title: 'Sign in failed',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const signInWithApple = async () => {
    try {
      await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Apple, customState: storeCustomState() });
    } catch (err: unknown) {
      toast({
        title: 'Sign in failed',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      queryClient.clear();
    } catch (err: unknown) {
      toast({
        title: 'Sign out failed',
        description: isError(err) ? err.message : 'Unknown error',
        status: 'error',
      });
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthenticationProviderProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Failed to load auth context. Make sure you are consuming the context within a provider block');
  }

  return context;
};

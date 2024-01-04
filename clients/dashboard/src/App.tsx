import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@sentry/react';
import { Amplify } from 'aws-amplify';
import * as Sentry from '@sentry/react';
import { theme } from '@packages/theme';
import {
  ListProjectsPage,
  AcceptAppInvitationPage,
  ErrorPage,
  SignInPage,
  SignUpPage,
  ConfirmAccountPage,
  ResetPasswordPage,
  VerifyResetPasswordPage,
  NotFoundPage,
  CreateProjectPage,
  DashboardPage,
  ProjectSettingsPage,
  ProjectUsersPage,
} from './pages';
import { AuthProvider, AppConfigProvider, ProjectProvider, useAppConfigContext } from './providers';
import { SubscribePage } from './pages/onboarding';
import { ProfileSettingsPage } from './pages/settings/profile-settings';
import { BillingSettingsPage } from './pages/settings/billing-settings';
import { FilesPage } from './pages/project/files';
import { GuardedRoute } from './routing';
import { HasSubscriptionGuard } from './routing/guards/HasSubscriptionGuard';
import { AuthenticatedLayout, ProjectLayout, SettingsLayout } from './layouts';
import { IsAuthenticatedGuard } from './routing/guards/IsAuthenticatedGuard';
import { HasSelectedProjectGuard } from './routing/guards/HasSelectedProjectGuard';
import { ApiError } from './hooks';


if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (failureCount > 3) {
          return false;
        }

        if (error instanceof ApiError && [400, 401, 403, 404].includes(error.status ?? 0)) {
          return false;
        }

        return true;
      },
    },
  },
});

const ConfigureAmplify = () => {
  const { config } = useAppConfigContext();

  Amplify.configure({
    Auth: config.mockTokens
      ? undefined
      : {
          userPoolId: config.awsCognitoUserpoolId,
          identityPoolId: config.awsCognitoIdentityPoolId,
          region: config.awsRegion,
          userPoolWebClientId: config.awsCognitoAppClientId,
          oauth: {
            domain: config.awsCognitoLoginDomain,
            redirectSignIn: `${window.location.protocol}//${window.location.host}/sign-in`,
            redirectSignOut: `${window.location.protocol}//${window.location.host}/sign-in`,
            responseType: 'code',
          },
        },
    Storage: {
      AWSS3: {
        bucket: config.awsS3AssetsBucket,
        region: config.awsRegion,
      },
    },
  });

  return null;
};

export const App = () => {
  return (
    <Router>
      <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: 'bottom-right', variant: 'subtle' } }}>
        <ErrorBoundary fallback={<ErrorPage />}>
          <QueryClientProvider client={queryClient}>
            <AppConfigProvider>
              <ConfigureAmplify />
              <AuthProvider>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} type="localStorage" />
                <Routes>
                  <Route
                    path="/account"
                    element={<GuardedRoute layout={AuthenticatedLayout} guards={[IsAuthenticatedGuard]} />}
                  >
                    <Route path="invitations/:id" element={<AcceptAppInvitationPage />} />
                  </Route>

                  <Route
                    path="/projects"
                    element={
                      <ProjectProvider>
                        <GuardedRoute layout={AuthenticatedLayout} guards={[IsAuthenticatedGuard]} />
                      </ProjectProvider>
                    }
                  >
                    <Route index element={<ListProjectsPage />} />
                  </Route>

                  <Route
                    path="/projects/create"
                    element={
                      <ProjectProvider>
                        <GuardedRoute
                          layout={AuthenticatedLayout}
                          guards={[IsAuthenticatedGuard, HasSubscriptionGuard]}
                        />
                      </ProjectProvider>
                    }
                  >
                    <Route index element={<CreateProjectPage />} />
                  </Route>

                  <Route
                    path="/projects/:id"
                    element={
                      <ProjectProvider>
                        <GuardedRoute layout={ProjectLayout} guards={[IsAuthenticatedGuard, HasSelectedProjectGuard]} />
                      </ProjectProvider>
                    }
                  >
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="files" element={<FilesPage />} />
                    <Route path="users" element={<ProjectUsersPage />} />
                    <Route path="users" element={<ProjectUsersPage />} />
                    <Route path="settings" element={<ProjectSettingsPage />} />
                  </Route>

                  <Route
                    path="/onboarding"
                    element={<GuardedRoute layout={AuthenticatedLayout} guards={[IsAuthenticatedGuard]} />}
                  >
                    <Route index element={<SubscribePage />} />
                  </Route>

                  <Route
                    path="/settings"
                    element={
                      <ProjectProvider>
                        <GuardedRoute layout={SettingsLayout} guards={[IsAuthenticatedGuard]} />
                      </ProjectProvider>
                    }
                  >
                    <Route path="profile" element={<ProfileSettingsPage />} />
                    <Route path="billing" element={<BillingSettingsPage />} />
                    <Route index element={<Navigate to="/settings/profile" />} />
                  </Route>

                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                  <Route path="/sign-up/confirm" element={<ConfirmAccountPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/reset-password/verify" element={<VerifyResetPasswordPage />} />

                  <Route path="/" element={<Navigate to="/projects" />} />

                  <Route path="/*" element={<NotFoundPage />} />
                </Routes>
              </AuthProvider>
            </AppConfigProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ChakraProvider>
    </Router>
  );
};

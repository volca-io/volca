import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Amplify } from 'aws-amplify';
import {
  CreateProjectPage,
  DashboardPage,
  ProjectListPage,
  ProjectSettingsPage,
  SignInPage,
  ProjectUsersPage,
  AcceptProjectInvitationPage,
  NotFoundPage,
  SignUpPage,
  SubscribePage,
  SettingsPage,
} from './pages';
import { theme } from './theme';
import { ResetPasswordPage } from './pages/reset-password';
import { VerifyResetPasswordPage } from './pages/verify-reset-password';
import { ProjectsProvider, LoadingProvider, AuthProvider, AppConfigProvider, useAppConfigContext } from './providers';
import { ConfirmAccountPage } from './pages/confirm-account';
import { ErrorPage } from './pages/error-page';
import { AuthenticatedRoute, ProjectRoute, SubscriptionRoute, SignInRoute } from './routing';
import { FilesPage } from './pages/files';

const ConfigureAmplify = () => {
  const { config } = useAppConfigContext();

  Amplify.configure({
    Auth: {
      userPoolId: config.awsCognitoUserpoolId,
      identityPoolId: config.awsCognitoIdentityPoolId,
      region: config.awsRegion,
      userPoolWebClientId: config.awsCognitoAppClientId,
      oauth: {
        domain: config.awsCognitoLoginDomain,
        redirectSignIn: `${window.location.protocol}//${window.location.host}`,
        redirectSignOut: `${window.location.protocol}//${window.location.host}`,
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

export const App = () => (
  <Router>
    <ChakraProvider theme={theme}>
      <ErrorBoundary fallback={<ErrorPage />}>
        <LoadingProvider>
          <AppConfigProvider>
            <ConfigureAmplify />
            <AuthProvider>
              <ProjectsProvider>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} type="localStorage" />
                <Routes>
                  <Route
                    index
                    element={
                      <SubscriptionRoute>
                        <ProjectListPage />
                      </SubscriptionRoute>
                    }
                  />
                  <Route
                    path="/projects/create"
                    element={
                      <SubscriptionRoute>
                        <CreateProjectPage />
                      </SubscriptionRoute>
                    }
                  />
                  <Route
                    path="/projects/:id/dashboard"
                    element={
                      <ProjectRoute>
                        <DashboardPage />
                      </ProjectRoute>
                    }
                  />
                  <Route
                    path="/projects/:id/files"
                    element={
                      <ProjectRoute>
                        <FilesPage />
                      </ProjectRoute>
                    }
                  />
                  <Route
                    path="/projects/:id/settings"
                    element={
                      <ProjectRoute>
                        <ProjectSettingsPage />
                      </ProjectRoute>
                    }
                  ></Route>
                  <Route
                    path="/projects/:id/users"
                    element={
                      <ProjectRoute>
                        <ProjectUsersPage />
                      </ProjectRoute>
                    }
                  ></Route>
                  <Route
                    path="/invitations/:id"
                    element={
                      <AuthenticatedRoute>
                        <AcceptProjectInvitationPage />
                      </AuthenticatedRoute>
                    }
                  ></Route>
                  <Route
                    path="/onboarding"
                    element={
                      <AuthenticatedRoute>
                        <SubscribePage />
                      </AuthenticatedRoute>
                    }
                  ></Route>
                  <Route
                    path="/settings"
                    element={
                      <AuthenticatedRoute>
                        <SettingsPage />
                      </AuthenticatedRoute>
                    }
                  ></Route>
                  {/* PUBLIC ROUTES */}
                  <Route
                    path="/sign-in"
                    element={
                      <SignInRoute>
                        <SignInPage />
                      </SignInRoute>
                    }
                  />
                  <Route
                    path="/sign-up"
                    element={
                      <SignInRoute>
                        <SignUpPage />
                      </SignInRoute>
                    }
                  />
                  <Route
                    path="/sign-up/confirm"
                    element={
                      <SignInRoute>
                        <ConfirmAccountPage />
                      </SignInRoute>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <SignInRoute>
                        <ResetPasswordPage />
                      </SignInRoute>
                    }
                  />
                  <Route
                    path="/reset-password/verify"
                    element={
                      <SignInRoute>
                        <VerifyResetPasswordPage />
                      </SignInRoute>
                    }
                  />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ProjectsProvider>
            </AuthProvider>
          </AppConfigProvider>
        </LoadingProvider>
      </ErrorBoundary>
    </ChakraProvider>
  </Router>
);

import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import {
  CreateProjectPage,
  DashboardPage,
  ProjectListPage,
  ProjectSettingsPage,
  SignInPage,
  ProjectUsersPage,
  AcceptProjectInvitationPage,
  LoadingPage,
  NotFoundPage,
  RegisterPage,
  SubscribePage,
  SettingsPage,
} from './pages';
import { theme } from './theme';
import { AuthenticatedRoute } from './routing/AuthenticatedRoute';
import { ProjectRoute } from './routing/ProjectRoute';
import { ResetPasswordPage } from './pages/reset-password';
import { VerifyResetPasswordPage } from './pages/verify-reset-password';
import { VerifyUserPage } from './pages/verify-user';
import { SubscriptionRoute } from './routing/SubscriptionRoute';

export const App = () => (
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} type="localStorage" />
    <RecoilRoot>
      <React.Suspense fallback={<LoadingPage />}>
        <Router>
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
              path="/invitations/:key"
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
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyUserPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password/verify" element={<VerifyResetPasswordPage />} />
            <Route path=":any" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </React.Suspense>
    </RecoilRoot>
  </ChakraProvider>
);

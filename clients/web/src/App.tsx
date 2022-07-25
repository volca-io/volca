import React from 'react';
import { ChakraProvider, ColorModeScript, localStorageManager } from '@chakra-ui/react';
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

export const App = () => (
  <RecoilRoot>
    <React.Suspense fallback={<LoadingPage />}>
      <ColorModeScript initialColorMode="system" />
      <Router>
        <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
          <Routes>
            <Route
              index
              element={
                <AuthenticatedRoute>
                  <DashboardPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <AuthenticatedRoute>
                  <CreateProjectPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <AuthenticatedRoute>
                  <ProjectListPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects/:id/settings"
              element={
                <AuthenticatedRoute>
                  <ProjectRoute>
                    <ProjectSettingsPage />
                  </ProjectRoute>
                </AuthenticatedRoute>
              }
            ></Route>
            <Route
              path="/projects/:id/users"
              element={
                <AuthenticatedRoute>
                  <ProjectRoute>
                    <ProjectUsersPage />
                  </ProjectRoute>
                </AuthenticatedRoute>
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
              path="/subscribe"
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
            <Route path=":any" element={<NotFoundPage />} />
          </Routes>
        </ChakraProvider>
      </Router>
    </React.Suspense>
  </RecoilRoot>
);

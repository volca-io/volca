import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './providers/user-provider';
import { CreateProject, Dashboard, ProjectList, SignInPage, ProjectDetails } from './pages';
import { theme } from './theme';
import { AuthenticatedRoute } from './routing/AuthenticatedRoute';
import { ProjectProvider } from './providers/project-provider';

export const App = () => (
  <UserProvider>
    <ProjectProvider>
      <ColorModeScript />
      <Router>
        <ChakraProvider theme={theme}>
          <Routes>
            {/* AUTHENTICATED ROUTES */}
            <Route
              index
              element={
                <AuthenticatedRoute>
                  <Dashboard />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <AuthenticatedRoute>
                  <CreateProject />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <AuthenticatedRoute>
                  <ProjectList />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <AuthenticatedRoute>
                  <ProjectDetails />
                </AuthenticatedRoute>
              }
            ></Route>

            {/* PUBLIC ROUTES */}
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </ChakraProvider>
      </Router>
    </ProjectProvider>
  </UserProvider>
);

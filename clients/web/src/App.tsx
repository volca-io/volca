import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CreateProject, Dashboard, ProjectList } from './pages';
import { ProjectDetails } from './pages/project-details';
import { theme } from './theme';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Routes>
        <Route index element={<Dashboard />}></Route>
        <Route path="/projects/create" element={<CreateProject />}></Route>
        <Route path="/projects" element={<ProjectList />}></Route>
        <Route path="/projects/:id" element={<ProjectDetails />}></Route>
      </Routes>
    </Router>
  </ChakraProvider>
);

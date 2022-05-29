import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages';
import { theme } from './theme';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Routes>
        <Route index element={<Dashboard />}></Route>
      </Routes>
    </Router>
  </ChakraProvider>
);

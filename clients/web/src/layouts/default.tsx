import { Box } from '@chakra-ui/react';
import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <Box minH="100vh">{children}</Box>;
};

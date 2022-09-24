import { Flex } from '@chakra-ui/react';
import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <Flex flexDirection="column" height="100vh">
      {children}
    </Flex>
  );
};

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { Footer, MainContent, MainPanel } from '../components/layout';
import { Logo } from '../components/Logo';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <Flex flexDir="column" minH="100vh">
      <Box p={4}>
        <Logo />
      </Box>
      <MainPanel>
        <MainContent>{children}</MainContent>
        <Footer />
      </MainPanel>
    </Flex>
  );
};

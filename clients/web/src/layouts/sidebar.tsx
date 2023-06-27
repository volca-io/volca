import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Footer, Sidebar, MainPanel, MainContent } from '../components/layout';
import { LoadingBar } from '../components/generic/LoadingBar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, sidebar = true }) => {
  return (
    <Flex flexDir="column" minH="100vh">
      <LoadingBar full />

      <Sidebar hidden={!sidebar} />
      <MainPanel clearSidebar={sidebar}>
        <MainContent>{children}</MainContent>
        <Footer />
      </MainPanel>
    </Flex>
  );
};

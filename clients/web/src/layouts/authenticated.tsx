import React from 'react';
import { VStack } from '@chakra-ui/react';
import { Footer, Sidebar, MainPanel, MainContent } from '../components/layout';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, sidebar = true }) => {
  return (
    <Sidebar hidden={!sidebar}>
      <MainPanel>
        <MainContent>
          <VStack align="flex-start">{children}</VStack>
        </MainContent>
        <Footer />
      </MainPanel>
    </Sidebar>
  );
};

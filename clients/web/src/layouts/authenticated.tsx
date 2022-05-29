import * as React from 'react';
import { VStack } from '@chakra-ui/react';
import { Footer, Header, Sidebar } from '../components';
import { MainPanel } from '../components/layout/main-panel';
import { MainContent } from '../components/layout/main-content';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <MainPanel>
        <Header />
        <MainContent>
          <VStack align="flex-start">{children}</VStack>
        </MainContent>
        <Footer />
      </MainPanel>
    </>
  );
};

import React from 'react';
import { VStack } from '@chakra-ui/react';
import {} from '../components';
import { MainPanel } from '../components/layout/main-panel';
import { MainContent } from '../components/layout/main-content';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <MainPanel>
        <MainContent>
          <VStack align="flex-start">{children}</VStack>
        </MainContent>
      </MainPanel>
    </>
  );
};

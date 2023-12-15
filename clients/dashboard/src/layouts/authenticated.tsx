import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Footer, MainPanel, MainContent } from '../components/layout';
import { TopBar } from '../components/sidebar/TopBar';
import { IconType } from 'react-icons';
import { Logo } from '../components/Logo';

interface SidebarLayoutProps {
  title?: string;
  icon?: IconType;
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<SidebarLayoutProps> = ({ title, icon, children }) => {
  return (
    <Flex flexDir="column" minH="100vh">
      <Flex justifyContent="space-between">
        <Flex p={4} justifyContent="center" alignItems="center">
          <Logo />
        </Flex>
        <TopBar title={title} icon={icon} />
      </Flex>
      <MainPanel>
        <MainContent>{children}</MainContent>
        <Footer />
      </MainPanel>
    </Flex>
  );
};

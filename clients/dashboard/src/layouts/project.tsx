import React from 'react';
import { Box, Drawer, DrawerContent, Flex, useDisclosure } from '@chakra-ui/react';
import { Footer, MainContent, MainPanel } from '../components/layout';
import { TopBar } from '../components/sidebar/TopBar';
import { IconType } from 'react-icons';
import { ProjectSidebar } from '../components/sidebar/ProjectSidebar';

interface ProjectLayoutProps {
  children: React.ReactNode;
  title?: string;
  icon?: IconType;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({ title, icon, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex flexDir="column" minH="100vh">
      <Box position="fixed" top={0} left={0}>
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <ProjectSidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>
      </Box>

      <Flex flexGrow="1">
        <Box display={{ base: 'none', md: 'block' }}>
          <ProjectSidebar onClose={onClose} />
        </Box>
        <MainPanel>
          <TopBar title={title} icon={icon} onOpenDrawer={onOpen} />
          <MainContent>{children}</MainContent>
          <Footer />
        </MainPanel>
      </Flex>
    </Flex>
  );
};

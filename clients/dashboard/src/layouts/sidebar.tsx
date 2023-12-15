import React from 'react';
import { Box, Drawer, DrawerContent, Flex, useDisclosure } from '@chakra-ui/react';
import { Footer, MainContent, MainPanel } from '../components/layout';
import { TopBar } from '../components/sidebar/TopBar';
import { IconType } from 'react-icons';

interface SidebarLayoutProps {
  children: React.ReactNode;
  title?: string;
  sidebar: ({ onClose }: { onClose: () => void }) => React.ReactNode;
  icon?: IconType;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ title, icon, sidebar: Sidebar, children }) => {
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
            <Sidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>
      </Box>

      <Flex flexGrow="1">
        <Flex display={{ base: 'none', md: 'flex' }}>
          <Sidebar onClose={onClose} />
        </Flex>
        <MainPanel>
          <TopBar title={title} icon={icon} onOpenDrawer={onOpen} />
          <MainContent>{children}</MainContent>
          <Footer />
        </MainPanel>
      </Flex>
    </Flex>
  );
};

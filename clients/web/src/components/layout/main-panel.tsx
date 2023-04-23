import * as React from 'react';
import { Flex, useColorModeValue } from '@chakra-ui/react';

interface MainPanelProps {
  children: React.ReactNode;
  clearSidebar: boolean;
}

export const MainPanel: React.FC<MainPanelProps> = ({ children, clearSidebar }) => {
  const bg = useColorModeValue('gray.100', 'black');

  return (
    <Flex
      overflow="auto"
      position="relative"
      transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
      transitionDuration=".2s, .2s, .35s"
      transitionProperty="top, bottom, width"
      transitionTimingFunction="linear, linear, ease"
      flexDir="column"
      flexGrow="1"
      ml={{ base: 0, md: clearSidebar ? 60 : 0 }}
      bg={bg}
    >
      {children}
    </Flex>
  );
};

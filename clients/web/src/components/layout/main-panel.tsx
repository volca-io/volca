import * as React from 'react';
import { Box, Flex } from '@chakra-ui/react';

interface MainPanelProps {
  children: React.ReactNode;
}

export const MainPanel: React.FC<MainPanelProps> = ({ children }) => (
  <Box
    w={{
      base: '100%',
    }}
    maxW="100%"
    h="100vh"
    overflow="auto"
    position="relative"
    transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
    transitionDuration=".2s, .2s, .35s"
    transitionProperty="top, bottom, width"
    transitionTimingFunction="linear, linear, ease"
  >
    <Flex flexDir="column" height="100%">
      {children}
    </Flex>
  </Box>
);

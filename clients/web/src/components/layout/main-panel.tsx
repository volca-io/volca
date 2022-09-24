import * as React from 'react';
import { Flex } from '@chakra-ui/react';

interface MainPanelProps {
  children: React.ReactNode;
}

export const MainPanel: React.FC<MainPanelProps> = ({ children }) => (
  <Flex
    width="100%"
    height="100%"
    overflow="auto"
    position="relative"
    transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
    transitionDuration=".2s, .2s, .35s"
    transitionProperty="top, bottom, width"
    transitionTimingFunction="linear, linear, ease"
    flexDir="column"
    flexGrow="1"
  >
    {children}
  </Flex>
);

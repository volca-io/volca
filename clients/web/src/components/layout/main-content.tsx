import * as React from 'react';
import { Flex } from '@chakra-ui/react';

interface MainPanelProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainPanelProps> = ({ children }) => (
  <Flex flexDirection="column" flex={1} p={5}>
    {children}
  </Flex>
);

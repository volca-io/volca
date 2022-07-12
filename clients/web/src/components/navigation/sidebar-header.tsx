import * as React from 'react';
import { Flex, Text } from '@chakra-ui/react';

export const SidebarHeader: React.FC = () => {
  return (
    <Flex pt={5} pb={5} ps={2} pe={2} flexDir="row" alignItems="center" justifyContent="center">
      <Text fontSize="2xl" mr={2}>
        🌋
      </Text>
      <Text fontSize="small" as="h1" fontWeight="bold">
        VOLCA
      </Text>
    </Flex>
  );
};

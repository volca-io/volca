import * as React from 'react';
import { Flex, Link, Text } from '@chakra-ui/react';

export const Footer: React.FC = () => (
  <Flex p="2" justifyContent="center">
    <Text fontSize={12}>
      Powered by{' '}
      <Link href="https://volca.io" isExternal>
        <u>Volca</u>
      </Link>
    </Text>
  </Flex>
);

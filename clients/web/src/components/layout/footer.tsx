import * as React from 'react';
import { Flex, Link, Text } from '@chakra-ui/react';

export const Footer: React.FC = () => (
  <Flex p="2" justifyContent="center">
    <Text>
      Powered by{' '}
      <Link href="https://volca.io" isExternal>
        <u>Volca</u>
      </Link>
    </Text>
  </Flex>
);

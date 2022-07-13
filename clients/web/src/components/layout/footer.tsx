import * as React from 'react';
import { Flex, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export const Footer: React.FC = () => (
  <Flex p="2" justifyContent="center">
    <Text>
      © 2022, Made by{' '}
      <Link to="https://volka.io" as={RouterLink}>
        Volca.io
      </Link>
    </Text>
  </Flex>
);

import { Flex, Heading } from '@chakra-ui/react';
import { DefaultLayout } from '../layouts';

export const NotFoundPage = () => (
  <DefaultLayout>
    <Flex justifyContent="center" alignItems="center" flex={1}>
      <Heading>404 - Page not found</Heading>
    </Flex>
  </DefaultLayout>
);

import { Flex, Heading } from '@chakra-ui/react';
import { DefaultLayout } from '../layouts';

export const NotFoundPage = () => (
  <DefaultLayout>
    <Flex w="100%" alignItems="center" justifyContent="center">
      <Heading>404 - Page not found</Heading>
    </Flex>
  </DefaultLayout>
);

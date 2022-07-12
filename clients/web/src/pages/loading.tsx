import { Flex, Spinner } from '@chakra-ui/react';
import { DefaultLayout } from '../layouts';

export const LoadingPage = () => (
  <DefaultLayout>
    <Flex w="100%" alignItems="center" justifyContent="center">
      <Spinner size="xl" />
    </Flex>
  </DefaultLayout>
);

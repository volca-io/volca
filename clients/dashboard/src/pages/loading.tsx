import { Flex, Spinner } from '@chakra-ui/react';
import { Logo } from '../components/Logo';

export const LoadingPage = () => (
  <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center" flexDir="column" gap={6}>
    <Logo linkToHome={false} />
    <Spinner size="lg" />
  </Flex>
);

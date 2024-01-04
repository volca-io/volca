import { Container, Flex } from '@chakra-ui/react';

export const Banner = ({ children }: { children: React.ReactNode }) => (
  <Flex bgGradient="linear-gradient(to right, gradient.start, gradient.end)">
    <Container maxW="8xl" justifyContent="center">
      <Flex justifyContent="center" p={2}>{children}</Flex>
    </Container>
  </Flex>
);

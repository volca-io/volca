import { Flex, Heading, Text } from '@chakra-ui/react';

const Page = ({ is404 }: { is404: boolean }) => {
  return (
    <Flex flexGrow={1} flexDirection="column" alignItems="center" justifyContent="center">
      {is404 ? (
        <>
          <Heading fontSize="6xl">404</Heading>
          <Text fontSize="xl">The page you are looking for does not exist</Text>
        </>
      ) : (
        <>
          <Heading fontSize="6xl">Error</Heading>
          <Text fontSize="xl">An unknown error occurred</Text>
        </>
      )}
    </Flex>
  );
};

export default Page;

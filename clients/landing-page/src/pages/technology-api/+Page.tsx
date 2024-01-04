import { Container, Flex, Heading, Link, Text } from '@chakra-ui/react';

const Page = () => (
  <Container maxW="6xl" py={12}>
    <Flex flexDirection="column" gap={8}>
      <Flex flexDirection="column">
        <Heading>Technology API</Heading>
        <Text>API providing lists of programming languages, databases and more</Text>
      </Flex>

      <Flex flexDirection="column">
        <Link fontSize="large" fontWeight="bold" href="/technology-api/languages.json">
          /languages.json
        </Link>
        <Text>List of programming languages</Text>
      </Flex>

      <Flex flexDirection="column">
        <Link fontSize="large" fontWeight="bold" href="/technology-api/relational-databases.json">
          /relational-databases.json
        </Link>
        <Text>List of relational databases</Text>
      </Flex>

      <Flex flexDirection="column">
        <Link fontSize="large" fontWeight="bold" href="/technology-api/nosql-databases.json">
          /nosql-databases.json
        </Link>
        <Text>List of NoSQL databases</Text>
      </Flex>
    </Flex>
  </Container>
);

export default Page;

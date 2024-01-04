import { Container, Flex, Heading, Text } from '@chakra-ui/react';

export const SectionHeader = ({
  category,
  title,
  description,
  type = 'h1',
  align = 'center',
}: {
  category: string;
  title: string;
  description: React.ReactNode;
  type?: 'h1' | 'h2';
  align?: 'start' | 'center' | 'end';
}) => (
  <Container maxW="4xl" centerContent gap={3} mb={6} alignItems={align}>
    <Text fontSize="md" color="brand.200" fontWeight="bold">
      {category}
    </Text>
    <Flex flexDirection="column" gap={5} alignItems={align}>
      <Heading as={type} fontSize="4xl" textAlign={align}>
        {title}
      </Heading>
      <Text fontSize="xl" textAlign={align}>
        {description}
      </Text>
    </Flex>
  </Container>
);

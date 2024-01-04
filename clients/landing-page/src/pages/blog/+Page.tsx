import { Box, Button, Container, Flex, Heading, Link, StackDivider, Text, VStack } from '@chakra-ui/react';
import { MdArrowForward } from 'react-icons/md/index.js';
import { metadata } from './metadata';
import { SectionHeader } from '../../components/SectionHeader';

const Page = () => {
  return (
    <Container maxW="4xl" >
      <Flex flexDirection="column">
        <SectionHeader
          category="Blog"
          title="Volca Blog"
          description="Volca blog features productivity, tips and inspiration for building SaaS products. Find out how to build and
        market a successful software product."
        />
        <VStack divider={<StackDivider borderColor="gray.200" />} spacing={12} my={16}>
          {metadata.map((item) => (
            <VStack alignItems="flex-start" gap={8} width="100%" key={item.url}>
              <Box>
                <Link href={item.url} _hover={{ textDecoration: 'none', color: 'brand.400' }} color="white">
                  <Heading fontSize="2xl">{item.title}</Heading>
                </Link>
                <Text color="gray.500">
                  {item.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
              </Box>

              <Text>{item.description}</Text>

              <Button
                size="sm"
                as={Link}
                href={item.url}
                variant="outline"
                rightIcon={<MdArrowForward />}
                _hover={{ textDecoration: 'none' }}
              >
                Read more
              </Button>
            </VStack>
          ))}
        </VStack>
      </Flex>
    </Container>
  );
};

export default Page;

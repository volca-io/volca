import { Box, Container, Divider, Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import logo from '../assets/icon.svg';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box p={8}>
      <Divider />
      <Container maxW="6xl">
        <Flex gap={8} flexDirection={{ base: 'column', md: 'row' }} my={20}>
          <Flex flexGrow={1} flexBasis={0} flexDirection="column" gap={4}>
            <Flex gap={4}>
              <Image h={10} w="auto" src={logo} alt="Volca Logotype" />
            </Flex>
            <Text fontSize="medium">SaaS Starter Kit and Boilerplate</Text>
          </Flex>
          <Flex gap={4} flexGrow={1} flexBasis={0}>
            <Flex flexDirection="column" gap={2} flexGrow={1} flexBasis={0}>
              <Heading as="h2" fontSize="medium">
                KITS
              </Heading>

              <Link fontWeight="semibold" href="/kits/python/">
                Python and Django
              </Link>
              <Link fontWeight="semibold" href="/kits/ruby/">
                Ruby on Rails
              </Link>
              <Link fontWeight="semibold" href="/kits/php/">
                PHP
              </Link>
            </Flex>
            <Flex flexDirection="column" gap={2} flexGrow={1} flexBasis={0}>
              <Heading as="h2" fontSize="medium">
                LEGAL
              </Heading>

              <Link fontWeight="semibold" href="/terms/">
                Terms
              </Link>
              <Link fontWeight="semibold" href="/privacy-policy/">
                Privacy Policy
              </Link>
            </Flex>
            <Flex flexDirection="column" gap={2} flexGrow={1} flexBasis={0}>
              <Heading as="h2" fontSize="medium">
                RESOURCES
              </Heading>
              <Link fontWeight="semibold" href="/technology-api/">
                Technology API
              </Link>
              <Link fontWeight="semibold" href="/launch/">
                Launch
              </Link>
              <Link fontWeight="semibold" href="/open-source/">
                Open Source
              </Link>
            </Flex>
          </Flex>
        </Flex>

        <Flex justifyContent="center">
          <Text>© {year} SaaS Boilerplate and Starter Kit with Node.js and React - Volca.</Text>
        </Flex>
      </Container>
    </Box>
  );
};

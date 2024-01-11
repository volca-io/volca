import { Box, ChakraProvider, ColorModeScript, Container, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { theme } from '@project/theme';
import { Footer } from '../components/Footer.js';
import { Menu } from '../components/Menu.js';
import { PageContext } from '../types/PageContext.js';
import { PageContextProvider } from './usePageContext.js';
import { Banner } from '../components/Banner.js';

type PageShellProps = {
  children: React.ReactNode;
  pageContext: PageContext;
};

export const PageShell: React.FC<PageShellProps> = ({ children, pageContext }) => (
  <React.StrictMode>
    <PageContextProvider pageContext={pageContext}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} type="localStorage" />
        <Flex flexDirection="column">
          <Flex flexDirection="column">
            <Banner>
              <Text fontWeight="semibold" ><Box as="span" mr={2}>❄️</Box>Winter sale! Get 20% off with code WINTER at checkout</Text>
            </Banner>
            <Flex flexDirection="column" minH="100vh">
              <Menu />
              <Container maxW="8xl" display="flex" flexGrow={1}>
                {children}
              </Container>
              <Footer />
            </Flex>
          </Flex>
        </Flex>
      </ChakraProvider>
    </PageContextProvider>
  </React.StrictMode>
);

import {  ChakraProvider, ColorModeScript, Container, Flex } from '@chakra-ui/react';
import React from 'react';
import { theme } from '@project/theme';
import { Footer } from '../components/Footer.js';
import { Menu } from '../components/Menu.js';
import { PageContext } from '../types/PageContext.js';
import { PageContextProvider } from './usePageContext.js';


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

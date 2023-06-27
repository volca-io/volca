import { Box, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { LoadingBar } from '../components/generic/LoadingBar';

interface DefaultLayoutProps {
  displayLogo?: boolean;
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ displayLogo = false, children }) => {
  const logoSource = useColorModeValue('/logo-dark.svg', '/logo-light.svg');

  return (
    <Box>
      <LoadingBar full />
      <Flex
        flexDirection="column"
        height="100vh"
        p={{
          base: 4,
          sm: 8,
        }}
      >
        {displayLogo && (
          <Box>
            <Link to="/">
              <Image src={logoSource} boxSize="48px" />
            </Link>
          </Box>
        )}
        {children}
      </Flex>
    </Box>
  );
};

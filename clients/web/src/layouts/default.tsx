import { Box, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

interface DefaultLayoutProps {
  displayLogo?: boolean;
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ displayLogo = false, children }) => {
  const logoSource = useColorModeValue('/logo-dark.svg', '/logo-light.svg');

  return (
    <Flex flexDirection="column" height="100vh">
      {displayLogo && (
        <Box p={5} position="absolute">
          <Link to="/">
            <Image src={logoSource} boxSize="48px" />
          </Link>
        </Box>
      )}
      {children}
    </Flex>
  );
};

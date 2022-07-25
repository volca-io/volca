import * as React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

export const SoftCard = ({ children, style = {} }: { children?: React.ReactNode; style?: any }) => {
  const background = useColorModeValue('white', 'gray.700');

  return (
    <Box style={style} background={background} borderRadius="lg" p="8" boxShadow="lg">
      {children}
    </Box>
  );
};

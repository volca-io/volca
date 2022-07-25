import * as React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

export const SoftCard = ({ children, style = {} }: { children?: React.ReactNode; style?: any }) => {
  return (
    <Box style={style} background={useColorModeValue('white', 'gray.700')} borderRadius={16} p={6} w={'100%'}>
      {children}
    </Box>
  );
};

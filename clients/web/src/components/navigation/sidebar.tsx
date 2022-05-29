import * as React from 'react';
import { Box, Divider, useColorModeValue } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { SidebarHeader } from './sidebar-header';
import { NavLink } from './nav-link';

export const Sidebar: React.FC = () => {
  const variantChange = '0.2s linear';
  const sidebarBg = useColorModeValue('white', 'gray.700');

  return (
    <Box display={{ sm: 'none', xl: 'block' }} position="fixed">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="260px"
        maxW="260px"
        ms={{
          sm: '16px',
        }}
        my={{
          sm: '16px',
        }}
        h="calc(100vh - 32px)"
        ps="20px"
        pe="20px"
        borderRadius="16px"
      >
        <SidebarHeader />
        <Divider />
        <NavLink to="/" icon={<AddIcon />} title="Dashboard" />
        <NavLink to="/profile" icon={<AddIcon />} title="Profile" />
      </Box>
    </Box>
  );
};

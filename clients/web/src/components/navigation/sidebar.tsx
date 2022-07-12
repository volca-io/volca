import React from 'react';
import { Button, Box, Divider, useColorModeValue } from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import { SidebarHeader } from './sidebar-header';
import { NavLink } from './nav-link';
import { useNavigate } from 'react-router-dom';
import { currentProjectSelector } from '../../state/projects';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const selectedProject = useRecoilValue(currentProjectSelector);
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
        <Button
          onClick={() => navigate('/projects')}
          rightIcon={<RepeatIcon />}
          style={{ width: '100%', overflow: 'ellipsis' }}
        >
          {selectedProject ? selectedProject.name : '...'}
        </Button>
        <NavLink to="/" icon={<AddIcon />} title="Dashboard" />
        <NavLink to="/profile" icon={<AddIcon />} title="Profile" />
      </Box>
    </Box>
  );
};

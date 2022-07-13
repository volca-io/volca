import * as React from 'react';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { SignOutButton } from './SignOutButton';
import { useNavigate } from 'react-router-dom';

export const SettingsIcon: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Menu>
      <MenuButton as={Avatar} size="sm" />
      <MenuList>
        <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
        <SignOutButton>Sign out</SignOutButton>
      </MenuList>
    </Menu>
  );
};

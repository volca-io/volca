import * as React from 'react';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { SignOutButton } from './SignOutButton';

export const SettingsIcon: React.FC = () => {
  return (
    <Menu>
      <MenuButton as={Avatar} size="sm" />
      <MenuList>
        <MenuItem>Settings</MenuItem>
        <SignOutButton>Sign out</SignOutButton>
      </MenuList>
    </Menu>
  );
};

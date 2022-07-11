import * as React from 'react';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

export const SettingsIcon: React.FC = () => {
  return (
    <Menu>
      <MenuButton as={Avatar} size="sm" />
      <MenuList>
        <MenuItem>Settings</MenuItem>
      </MenuList>
    </Menu>
  );
};

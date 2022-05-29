import * as React from 'react';
import { Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

export const SettingsIcon: React.FC = () => {
  return (
    <Menu>
      <MenuButton as={Avatar} size="sm" />
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  );
};

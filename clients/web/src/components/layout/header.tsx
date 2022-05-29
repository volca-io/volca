import * as React from 'react';
import { Flex, Spacer } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { SettingsIcon } from '../settings-icon';

export const Header: React.FC = () => (
  <Flex alignItems="center" px={5} py={2}>
    <Spacer />
    <ColorModeSwitcher />
    <SettingsIcon />
  </Flex>
);

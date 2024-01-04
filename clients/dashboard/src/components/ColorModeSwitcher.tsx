import * as React from 'react';
import { useColorMode, useColorModeValue, IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa/index.js';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <Tooltip label={`Switch to ${text} mode`}>
      <IconButton
        variant="ghost"
        fontSize="xl"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        aria-label={`Switch to ${text} mode`}
        {...props}
      />
    </Tooltip>
  );
};

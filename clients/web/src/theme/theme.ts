import { extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';
import { globalStyles } from './styles';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({ ...globalStyles, config }, withDefaultColorScheme({ colorScheme: 'teal' }));

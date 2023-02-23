import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { globalStyles } from './styles';

const config: ThemeConfig = { initialColorMode: 'dark', useSystemColorMode: false  };

export const theme = extendTheme({ ...globalStyles, config});

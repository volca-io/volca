import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    gray: {
      700: '#1f2733',
    },
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
    mono: 'Consolas, monospace',
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
      },
      'html, body, #root': {
        minHeight: '100vh',
      },
    }),
  },
};

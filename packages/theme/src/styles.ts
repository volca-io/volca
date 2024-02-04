import { defineStyleConfig, baseTheme, createMultiStyleConfigHelpers, StyleFunctionProps } from '@chakra-ui/react';
import {
  tableAnatomy as tableParts,
  cardAnatomy as cardParts,
  modalAnatomy as modalParts,
  menuAnatomy as menuParts,
  tabsAnatomy as tabParts,
} from '@chakra-ui/anatomy';
import { mode } from '@chakra-ui/theme-tools';

const tableHelpers = createMultiStyleConfigHelpers(tableParts.keys);
const cardHelpers = createMultiStyleConfigHelpers(cardParts.keys);
const modalHelpers = createMultiStyleConfigHelpers(modalParts.keys);
const menuHelpers = createMultiStyleConfigHelpers(menuParts.keys);
const tabHelpers = createMultiStyleConfigHelpers(tabParts.keys);

const Button = defineStyleConfig({
  defaultProps: {
    variant: 'gradient',
  },
  variants: {
    gradient: {
      _hover: {
        _disabled: {
          backgroundSize: '180%',
          backgroundPosition: '60% center',
          bgGradient: `linear(to-r, gradient.start, gradient.end)`,
        },
        backgroundSize: '180%',
        backgroundPosition: '60% center',
        bgGradient: `linear(to-r, gradient.start, gradient.end)`,
      },
      backgroundSize: '180%',
      transition: 'all 0.3s ease-in-out 0s',
      border: 'none',
      color: 'white',
      bgGradient: `linear(to-r, gradient.start, gradient.end)`,
    },
  },
});

const Link = defineStyleConfig({
  baseStyle: {
    color: 'brand.400',
  },
});

const Badge = defineStyleConfig({
  baseStyle: {
    borderRadius: 4,
  },
});

const Table = tableHelpers.defineMultiStyleConfig({
  baseStyle: (props: StyleFunctionProps) => ({
    th: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: mode('gray.50', 'gray.900')(props),
      background: mode('gray.50', 'gray.900')(props),
      textTransform: 'capitalize',
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: mode('gray.200', 'gray.700')(props),
    },
  }),
  defaultProps: {
    variant: 'simple',
    size: 'md',
    colorScheme: 'gray',
  },
});

const Card = cardHelpers.defineMultiStyleConfig({
  baseStyle: (props: StyleFunctionProps) => ({
    container: {
      bg: mode('white', 'gray.950')(props),
      borderRadius: 'xl',
    },
  }),
});

const Modal = modalHelpers.defineMultiStyleConfig({
  baseStyle: (props: StyleFunctionProps) => ({
    dialog: {
      bg: mode('white', 'gray.950')(props),
    },
  }),
});

const Menu = menuHelpers.defineMultiStyleConfig({
  baseStyle: (props: StyleFunctionProps) => ({
    list: {
      bg: mode('white', 'gray.950')(props),
    },
    item: {
      bg: mode('white', 'gray.950')(props),
      _hover: {
        bg: mode('gray.50', 'gray.900')(props),
      },
    },
  }),
});

const Tabs = tabHelpers.defineMultiStyleConfig({
  defaultProps: {
    variant: 'soft-rounded',
  },
  variants: {
    'soft-rounded': {
      tab: {
        color: 'gray.400',
      },
    },
  },
});

export const globalStyles = {
  shadows: {
    brand: '0 0 100px 10px #fc476050',
  },
  colors: {
    brand: {
      50: '#ffe7de',
      100: '#ffbdb0',
      200: '#ff937f',
      300: '#ff694c',
      400: '#ff3f1a',
      500: '#e62600',
      600: '#b41b00',
      700: '#811200',
      800: '#500900',
      900: '#210000',
    },
    gray: {
      ...baseTheme.colors.gray,
      950: '#101118',
    },
    gradient: {
      start: '#FF512F',
      end: '#F09819',
    },
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
    mono: 'Consolas, monospace',
  },
  components: {
    Button,
    Link,
    Table,
    Card,
    Modal,
    Menu,
    Badge,
    Tabs,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('gray.100', 'black')(props),
      },
      'html, body, #root': {
        minHeight: '100vh',
      },
    }),
  },
};

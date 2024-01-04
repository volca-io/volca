import { Flex, FlexProps, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export interface NavItemProps extends FlexProps {
  name: string;
  icon: IconType;
  to: string;
}

export const NavItem = ({ name, icon, to, ...rest }: NavItemProps) => {
  const location = useLocation();

  const hoverStyle = {
    bg: useColorModeValue('gray.50', 'gray.800'),
    color: useColorModeValue('gray.900', 'white'),
  };

  const iconStyle = {
    bg: useColorModeValue('gray.50', 'gray.800'),
    color: useColorModeValue('gray.800', 'white'),
  };

  const activeMenuIconStyle = {
    bgGradient: 'linear(to-r, gradient.start, gradient.end)',
    color: 'white',
  };

  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      as={RouterLink}
      to={to}
      textDecoration="none"
      color={useColorModeValue('black', 'white')}
      _focus={{ boxShadow: 'none' }}
      _hover={{ textDecoration: 'none' }}
    >
      <Flex
        align="center"
        p={3}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={hoverStyle}
        {...(isActive ? hoverStyle : {})}
        {...rest}
      >
        <Flex
          borderRadius={4}
          mr={2}
          p={1}
          transition="background-color 100ms linear"
          {...iconStyle}
          _groupHover={activeMenuIconStyle}
          {...(isActive ? activeMenuIconStyle : {})}
        >
          {icon && <Icon fontSize="16" as={icon} />}
        </Flex>
        <Text fontSize="sm" fontWeight="semibold">
          {name}
        </Text>
      </Flex>
    </Link>
  );
};

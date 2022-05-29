import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  icon?: React.ReactElement;
  title: string;
}

const ActiveNavLink: React.FC<NavLinkProps> = ({ to, icon, title }) => {
  const color = useColorModeValue('gray.700', 'white');

  return (
    <Flex pt={2} pb={2}>
      {icon && <Box mr={2}>{icon}</Box>}
      <Text as={Link} to={to} fontWeight="bold" color={color}>
        {title}
      </Text>
    </Flex>
  );
};

const InactiveNavLink: React.FC<NavLinkProps> = ({ to, icon, title }) => {
  const color = useColorModeValue('gray.400', 'gray.400');

  return (
    <Flex pt={2} pb={2}>
      {icon && <Box mr={2}>{icon}</Box>}
      <Text as={Link} to={to} fontWeight="bold" color={color}>
        {title}
      </Text>
    </Flex>
  );
};

export const NavLink: React.FC<NavLinkProps> = (props) => {
  const location = useLocation();
  const isActive = matchPath(props.to, location.pathname);

  return isActive ? <ActiveNavLink {...props} /> : <InactiveNavLink {...props} />;
};

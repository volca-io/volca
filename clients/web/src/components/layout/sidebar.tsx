import React, { ReactNode } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Image,
  Spacer,
} from '@chakra-ui/react';
import { MdHomeFilled, MdSettings, MdMenu, MdKeyboardArrowDown, MdGroups } from 'react-icons/md';
import { IconType } from 'react-icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentProject, currentUser } from '../../state';
import { MdOutlineSync } from 'react-icons/md';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { SignOutButton } from '../authentication/SignOutButton';
import { ThemeSwitcher } from './theme-switcher';

interface LinkItemProps {
  name: string;
  onClick: () => void;
  icon: IconType;
}

export const Sidebar = ({ children, hidden = false }: { children: ReactNode; hidden: boolean }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('gray.100', 'gray.900');
  return (
    <Box minH="100vh" bg={bg}>
      {!hidden && <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} full={hidden} />
      <Box ml={{ base: 0, md: hidden ? 0 : 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

const Logo = () => (
  <RouterLink to="/">
    <Image src={useColorModeValue('/logo-dark.svg', '/logo-light.svg')} boxSize="64px" />
  </RouterLink>
);

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const [selectedProject] = useRecoilState(currentProject);
  const navigate = useNavigate();

  const LinkItems: Array<LinkItemProps> = [
    { name: 'Dashboard', onClick: () => navigate('/'), icon: MdHomeFilled },
    {
      name: 'Users',
      onClick: () => navigate(selectedProject ? `/projects/${selectedProject?.id}/users` : '/projects'),
      icon: MdGroups,
    },
    {
      name: 'Settings',
      onClick: () => navigate(selectedProject ? `/projects/${selectedProject?.id}/settings` : '/projects'),
      icon: MdSettings,
    },
  ];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="center">
        <Logo />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box px={4} w="100%">
        <Button
          onClick={() => navigate('/projects')}
          rightIcon={<MdOutlineSync />}
          padding="4"
          mb="4"
          w="100%"
          overflow="ellipsis"
          borderRadius="lg"
        >
          {selectedProject?.name || 'No Project'}
        </Button>
      </Box>
      {LinkItems.map((link) => (
        <NavItem onClick={link.onClick} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  onClick: () => void;
  children: string;
}
const NavItem = ({ icon, onClick, children, ...rest }: NavItemProps) => {
  return (
    <Link onClick={onClick} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  full?: boolean;
}

const MobileNav = ({ onOpen, full = false, ...rest }: MobileProps) => {
  const navigate = useNavigate();
  const user = useRecoilValue(currentUser);
  return (
    <Flex
      ml={{ base: 0, md: full ? 'full' : 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<MdMenu />}
      />

      {full && <Logo />}

      <Spacer display={{ base: 'none', md: 'flex' }} />

      <HStack spacing={{ base: '0', md: '6' }}>
        <ThemeSwitcher />
        <Flex alignItems="center">
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size="sm" {...(user && { name: `${user.first_name} ${user.last_name}` })} />
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">{user && `${user.first_name} ${user.last_name}`}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <MdKeyboardArrowDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem onClick={() => navigate('/projects')}>Projects</MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              <MenuDivider />
              <SignOutButton>Sign out</SignOutButton>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

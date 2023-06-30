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
import { MdHomeFilled, MdSettings, MdMenu, MdKeyboardArrowDown, MdGroups, MdCloudUpload } from 'react-icons/md';
import { IconType } from 'react-icons';
import { MdOutlineSync } from 'react-icons/md';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { SignOutButton } from '../authentication/SignOutButton';
import { ThemeSwitcher } from './theme-switcher';
import { SupportButton } from '../generic/SupportButton';
import { useProjectsContext, useAuthContext } from '../../providers';

interface LinkItemProps {
  name: string;
  onClick: () => void;
  icon: IconType;
}

export const Sidebar = ({ hidden = false }: { hidden: boolean }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {!hidden && <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'flex' }} />}
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
      <MobileNav onOpen={onOpen} full={hidden} />
    </>
  );
};

const Logo = () => (
  <RouterLink to="/">
    <Image src={useColorModeValue('/logo-dark.svg', '/logo-light.svg')} boxSize="48px" />
  </RouterLink>
);

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { selectedProject } = useProjectsContext();
  const navigate = useNavigate();

  const LinkItems: Array<LinkItemProps> = [
    {
      name: 'Dashboard',
      onClick: () => navigate(selectedProject ? `/projects/${selectedProject.id}/dashboard` : '/'),
      icon: MdHomeFilled,
    },
    {
      name: 'Files',
      onClick: () => navigate(selectedProject ? `/projects/${selectedProject.id}/files` : '/'),
      icon: MdCloudUpload,
    },
    {
      name: 'Users',
      onClick: () => navigate(selectedProject ? `/projects/${selectedProject.id}/users` : '/'),
      icon: MdGroups,
    },
    {
      name: 'Settings',
      onClick: () => navigate(selectedProject ? `/projects/${selectedProject.id}/settings` : '/'),
      icon: MdSettings,
    },
  ];

  return (
    <Flex
      transition="3s ease"
      bg={useColorModeValue('white', 'black')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      flexDirection="column"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem onClick={link.onClick} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
      <Flex flexGrow={1} p={10} />
      <Box px={4} w="100%">
        <Button
          onClick={() => navigate('/')}
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
    </Flex>
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
          bg: 'gray.900',
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
  const { user } = useAuthContext();

  return (
    <Flex
      ml={{ base: 0, md: full ? 'full' : 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'black')}
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

      {full && (
        <Box display={{ base: 'none', md: 'block' }}>
          <Logo />
        </Box>
      )}

      <Spacer display={{ base: 'none', md: 'flex' }} />

      <HStack spacing={{ base: '0', md: '6' }}>
        <SupportButton />
        <ThemeSwitcher />
        <Flex alignItems="center">
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size="sm" {...(user && { name: `${user.firstName} ${user.lastName}`, src: user.picture })} />
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">{user && `${user.firstName} ${user.lastName}`}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <MdKeyboardArrowDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/')}>Projects</MenuItem>
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

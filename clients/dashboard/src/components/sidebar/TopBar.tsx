import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../providers';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';
import { MdBusiness, MdKeyboardArrowDown, MdMenu, MdSettings } from 'react-icons/md/index.js';
import { IconType } from 'react-icons';
import { SignOutButton } from '../authentication/SignOutButton';
import { PageHeading } from '../generic/PageHeading';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { SupportButton } from '../SupportButton';

interface TopBarProps {
  onOpenDrawer?: () => void;
  title?: string;
  icon?: IconType;
}

export const TopBar: React.FC<TopBarProps> = ({ title, icon, onOpenDrawer }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <Flex ml={{ base: 0 }} px={{ base: 4, md: 4 }} py={2} height={20} gap={4} alignItems="center" width="full">
      {onOpenDrawer && (
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="open menu"
          icon={<MdMenu />}
          onClick={onOpenDrawer}
        />
      )}
      {(title || icon) && <Flex>{title && <PageHeading title={title} />}</Flex>}

      <Box flexGrow={1} />
      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems="center" gap={4}>
          <SupportButton />
          <ColorModeSwitcher />
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
              <MenuItem onClick={() => navigate('/projects')} icon={<MdBusiness />}>
                My Projects
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings/profile')} icon={<MdSettings />}>
                Settings
              </MenuItem>
              <MenuDivider />
              <SignOutButton>Sign out</SignOutButton>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

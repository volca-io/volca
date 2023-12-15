import { Box, BoxProps, CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';

import { Logo } from '../Logo';
import { NavItem, NavItemProps } from './NavItem';

type Sections = Array<{ name?: string; items: NavItemProps[]; shouldDisplay?: () => boolean }>;

interface SidebarProps extends BoxProps {
  sections: Sections;
  onClose: () => void;
}

export const Sidebar = ({ sections, onClose, ...rest }: SidebarProps) => {
  return (
    <Flex
      w={{ base: 'full', md: 60 }}
      flexDirection="column"
      flexGrow={1}
      p={4}
      gap={4}
      bg={useColorModeValue('white', 'gray.950')}
      m={{ base: 0, md: 4 }}
      borderRadius={{ base: 'none', md: '2xl' }}
      {...rest}
    >
      <Flex alignItems="center" py={1} justifyContent={{ base: 'space-between', md: 'center' }}>
        <Logo />
        <CloseButton onClick={onClose} display={{ base: 'flex', md: 'none' }} />
      </Flex>
      <Box
        height="1px"
        w="full"
        bgGradient="linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, rgb(224, 225, 226) 49.52%, rgba(224, 225, 226, 0) 100%)"
      />
      <Flex flexDirection="column" gap={1}>
        {sections
          .filter(({ shouldDisplay }) => !shouldDisplay || shouldDisplay())
          .map(({ name, items }, index) => (
            <Flex key={index} mb={4} flexDirection="column" gap={2}>
              {name && (
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                  {name}
                </Text>
              )}
              {items.map(({ name, to, icon }) => (
                <NavItem
                  name={name}
                  key={to}
                  to={to}
                  icon={icon}
                  onClick={() => {
                    onClose();
                  }}
                />
              ))}
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};

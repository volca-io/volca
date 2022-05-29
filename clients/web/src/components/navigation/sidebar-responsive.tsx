import * as React from 'react';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerContent,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';

export const SidebarResponsive: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <HamburgerIcon color="gray.500" w="18px" h="18px" onClick={onOpen} />
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
        >
          <DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box>brand</Box>
              <Stack direction="column" mb="40px">
                <Box>links</Box>
              </Stack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

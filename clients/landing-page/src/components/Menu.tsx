import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Link,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Box,
  Container,
} from '@chakra-ui/react';
import {
  MdBusiness,
  MdCloud,
  MdDashboard,
  MdLocalShipping,
  MdLock,
  MdLogin,
  MdPayment,
  MdRocket,
  MdSearch,
} from 'react-icons/md/index.js';
import { FaWrench } from 'react-icons/fa/index.js';
import icon from '../assets/icon.svg';

const Logo = () => (
  <Link href="/">
    <Image src={icon} alt="Volca Logo" w={12} h={12} />
  </Link>
);

export const Menu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const Navigation = () => (
    <>
      <Button as={Link} href="/pricing/" variant="ghost">
        Pricing
      </Button>
      <ChakraMenu>
        <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />}>
          Features
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} href="/features/authentication/" icon={<MdLock />}>
            Authentication
          </MenuItem>
          <MenuItem as={Link} href="/features/social-sign-in/" icon={<MdLogin />}>
            Social Sign In
          </MenuItem>
          <MenuItem as={Link} href="/features/subscriptions/" icon={<MdPayment />}>
            Subscriptions
          </MenuItem>
          <MenuItem as={Link} href="/features/cicd/" icon={<MdLocalShipping />}>
            CI/CD
          </MenuItem>
          <MenuItem as={Link} href="/features/multi-tenancy/" icon={<MdBusiness />}>
            Multi Tenancy
          </MenuItem>
          <MenuItem as={Link} href="/features/logging/" icon={<MdSearch />}>
            Logging
          </MenuItem>
          <MenuItem as={Link} href="/features/serverless/" icon={<MdCloud />}>
            Serverless
          </MenuItem>
          <MenuItem as={Link} href="/features/iac/" icon={<FaWrench />}>
            Infrastructure as Code
          </MenuItem>
        </MenuList>
      </ChakraMenu>
      <ChakraMenu>
        <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />}>
          Use cases
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} href="/use-cases/admin-dashboard-template/" icon={<MdDashboard />}>
            Admin Dashboard
          </MenuItem>
        </MenuList>
      </ChakraMenu>
      <Button as={Link} href="https://docs.volca.io" variant="ghost">
        Docs
      </Button>
      <Button as={Link} href="/blog/" variant="ghost">
        Blog
      </Button>
    </>
  );

  return (
    <Flex
      as="menu"
      position="sticky"
      top={0}
      left={0}
      px={4}
      width="full"
      zIndex={3}
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        bottom: -2,
        backdropFilter: 'blur(16px)',
        mask: 'linear-gradient(to bottom, black 60px, transparent)',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      <Flex alignItems="center" py={4} zIndex={1} width="full">
        <Container maxW="8xl" px={0}>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap={8}>
              <Logo />
              <Flex display={{ base: 'none', md: 'flex' }} gap={2}>
                <Navigation />
              </Flex>
            </Flex>

            <Flex display={{ base: 'none', md: 'flex' }}>
              <Link href="https://app.volca.io">
                <Button leftIcon={<MdRocket />}>Explore demo</Button>
              </Link>
            </Flex>
            <Box display={{ base: 'flex', md: 'none' }}>
              <IconButton size="sm" icon={<HamburgerIcon />} aria-label="Menu button" onClick={onOpen} />
            </Box>
            <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="full">
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                  <Logo />
                </DrawerHeader>
                <DrawerBody>
                  <Flex direction="column" gap={4}>
                    <Navigation />
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
};

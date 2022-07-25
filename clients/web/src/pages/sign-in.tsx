import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Link,
} from '@chakra-ui/react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { SignInForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { useState } from 'react';

type ErrorDescription = {
  title: string;
  description: string;
};

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, getRememberInfo } = useUserActions();
  const [error, setError] = useState<ErrorDescription | null>(null);
  const [loading, setLoading] = useState(false);

  const titleColor = useColorModeValue('teal.400', 'teal.200');
  const textColor = useColorModeValue('gray.600', 'white');
  const linkColor = useColorModeValue('teal.400', 'teal.200');

  const redirectUser = () => {
    const continueUrl = new URLSearchParams(location.search).get('continue');
    navigate(continueUrl || '/projects');
  };

  const onSubmit = async ({ email, password, remember }: { email: string; password: string; remember: boolean }) => {
    try {
      setLoading(true);
      await signIn(email, password, remember);
      redirectUser();
    } catch (err: unknown) {
      // @ts-ignore
      setError({ title: 'Authentication failed', description: err.message });
    }
    setLoading(false);
  };

  const { identifier, remember } = getRememberInfo();

  return (
    <DefaultLayout>
      <Flex direction="column" p="10" flexGrow={1} justifyContent="center" alignItems="center">
        <VStack spacing="8" w="100%" maxW="600px" alignItems="flex-start">
          <Box>
            <Heading color={titleColor}>Welcome!</Heading>
            <Text fontSize="sm" color={textColor}>
              Enter your e-mail and password to sign in. Or{' '}
              <Link color={linkColor} to="/register" as={RouterLink}>
                create a new account
              </Link>
            </Text>
          </Box>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription>{error.description}</AlertDescription>
              <CloseButton
                alignSelf="flex-end"
                position="absolute"
                right={0}
                top={0}
                onClick={() => {
                  setError(null);
                }}
              />
            </Alert>
          )}
          <Box alignSelf="stretch">
            <SignInForm
              defaultIdentifier={identifier}
              defaultRemember={remember}
              onSubmit={onSubmit}
              loading={loading}
            />
          </Box>
        </VStack>
      </Flex>
    </DefaultLayout>
  );
};

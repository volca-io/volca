import { useState } from 'react';
import {
  Text,
  useColorModeValue,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Link,
  Image,
} from '@chakra-ui/react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { SignInForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';

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
      <Flex minH="100vh" direction="column" justifyContent="center" maxW="600px" margin="0 auto">
        <Flex paddingY="8" direction="column" alignItems="center">
          <Image src={useColorModeValue('/logo-dark.svg', '/logo-light.svg')} boxSize="128px" />
          <Text fontSize="sm" color={textColor}>
            Enter your e-mail and password to sign in. Or{' '}
            <Link color={linkColor} textDecoration="underline" textUnderlineOffset={1.5} to="/register" as={RouterLink}>
              create a new account
            </Link>
            .
          </Text>
        </Flex>
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
        <SoftCard>
          <SignInForm defaultIdentifier={identifier} defaultRemember={remember} onSubmit={onSubmit} loading={loading} />
        </SoftCard>
      </Flex>
    </DefaultLayout>
  );
};

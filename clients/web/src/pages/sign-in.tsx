import { useState } from 'react';
import { Text, useColorModeValue, Flex, Link, Image } from '@chakra-ui/react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { SignInForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';
import { AlertBox } from '../components/generic/AlertBox';

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
    navigate(continueUrl || '/');
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
      <Flex width="100%" alignSelf="center" flexGrow={1} justifyContent="center">
        <Flex
          direction="column"
          justifyContent={{ base: 'flex-start ', md: 'center' }}
          flexGrow={1}
          maxW={600}
          p={{
            base: 0,
            sm: 8,
          }}
        >
          <Flex direction="column" alignItems="center">
            <Image src={useColorModeValue('/logo-dark.svg', '/logo-light.svg')} boxSize="128px" />
          </Flex>
          {error && (
            <AlertBox
              status="error"
              title={error.title}
              description={error.description}
              onClose={() => {
                setError(null);
              }}
            />
          )}
          <SoftCard>
            <SignInForm
              defaultIdentifier={identifier}
              defaultRemember={remember}
              onSubmit={onSubmit}
              loading={loading}
            />
            <Flex justifyContent="space-between" mt={5}>
              <Text fontSize="sm" color={textColor}>
                <Link
                  color={linkColor}
                  textDecoration="underline"
                  textUnderlineOffset={1.5}
                  to="/register"
                  as={RouterLink}
                >
                  Create new account
                </Link>
              </Text>
              <Text fontSize="sm" color={textColor}>
                <Link
                  color={linkColor}
                  textDecoration="underline"
                  textUnderlineOffset={1.5}
                  to="/reset-password"
                  as={RouterLink}
                >
                  Forgot password{' '}
                </Link>
              </Text>
            </Flex>
          </SoftCard>
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

import { useState } from 'react';
import { Text, useColorModeValue, Flex, Link, Heading, Box } from '@chakra-ui/react';
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
  const { authnPassword, getRememberInfo } = useUserActions();
  const [error, setError] = useState<ErrorDescription | null>(null);
  const [loading, setLoading] = useState(false);

  const titleColor = useColorModeValue('teal.400', 'teal.200');
  const textColor = useColorModeValue('gray.600', 'white');
  const linkColor = useColorModeValue('teal.400', 'teal.200');

  const redirectUser = () => {
    const continueUrl = new URLSearchParams(location.search).get('continue');
    navigate(continueUrl || '/');
  };

  const onSubmit = async ({ email, password, remember }: { email: string; password: string; remember: boolean }) => {
    try {
      setLoading(true);
      await authnPassword(email, password, remember);
      redirectUser();
    } catch (err: unknown) {
      // @ts-ignore
      setError({ title: 'Authentication failed', description: err.message });
    }
    setLoading(false);
  };

  const { identifier, remember } = getRememberInfo();

  return (
    <DefaultLayout displayLogo>
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
          <Box paddingY="8">
            <Heading color={titleColor} mb={2}>
              Sign in
            </Heading>
            <Text fontSize="sm" color={textColor}>
              Don't have an account to sign in to?{' '}
              <Link
                color={linkColor}
                textDecoration="underline"
                textUnderlineOffset={1.5}
                to="/register"
                as={RouterLink}
              >
                Register an account instead
              </Link>
            </Text>
          </Box>
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
                  to="/reset-password"
                  as={RouterLink}
                >
                  Forgot your password?
                </Link>
              </Text>
            </Flex>
          </SoftCard>
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

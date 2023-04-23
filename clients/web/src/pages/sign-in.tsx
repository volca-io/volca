import { useEffect } from 'react';
import { Text, Flex, Link, Heading, Box } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { SignInForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';
import { currentUserState } from '../state';

export const SignInPage: React.FC = () => {
  const { authnPassword, getRememberInfo } = useUserActions();
  const user = useRecoilValue(currentUserState);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async ({ email, password, remember }: { email: string; password: string; remember: boolean }) =>
    await authnPassword(email, password, remember);

  const { identifier, remember } = getRememberInfo();

  return (
    <DefaultLayout displayLogo>
      <Flex width="100%" alignSelf="center" flexGrow={1} justifyContent="center">
        <Flex direction="column" justifyContent={{ base: 'flex-start ', md: 'center' }} flexGrow={1} maxW={600}>
          <Box paddingY="8">
            <Heading mb={2}>Sign in</Heading>
            <Text fontSize="sm">
              Don't have an account to sign in to?{' '}
              <Link textDecoration="underline" textUnderlineOffset={1.5} to="/register" as={RouterLink}>
                Register an account instead
              </Link>
            </Text>
          </Box>
          <SoftCard>
            <SignInForm defaultIdentifier={identifier} defaultRemember={remember} onSubmit={onSubmit} />
            <Flex justifyContent="space-between" mt={5}>
              <Text fontSize="sm">
                <Link textDecoration="underline" textUnderlineOffset={1.5} to="/reset-password" as={RouterLink}>
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

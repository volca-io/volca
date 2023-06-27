import { Flex, Heading, Box, IconButton, Text, Divider, Link } from '@chakra-ui/react';
import { useEffect } from 'react';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SignUpForm } from '../components/forms';
import { SoftCard } from '../components/generic/SoftCard';

import { DefaultLayout } from '../layouts';
import { useAuthContext } from '../providers';

export const SignUpPage: React.FC = () => {
  const { signUpWithEmailAndPassword, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuthContext();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async ({
    email,
    password,
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    await signUpWithEmailAndPassword({ email, password, firstName, lastName });
  };

  return (
    <DefaultLayout displayLogo>
      <Flex width="100%" alignSelf="center" flexGrow={1} justifyContent="center" alignItems="center">
        <Box w={460}>
          <SoftCard>
            <Flex alignItems="center" flexDir="column">
              <Heading mb={2} size="md" paddingBottom={4}>
                Register with
              </Heading>

              <Flex flexDir="row" justifyContent="center" gap={4}>
                <IconButton
                  variant="outline"
                  aria-label="Continue with Apple"
                  icon={<FaApple />}
                  onClick={signInWithApple}
                  size="lg"
                />
                <IconButton
                  variant="outline"
                  aria-label="Continue with Facebook"
                  icon={<FaFacebook />}
                  onClick={signInWithFacebook}
                  size="lg"
                />
                <IconButton
                  variant="outline"
                  aria-label="Coninue with Google"
                  icon={<FaGoogle />}
                  onClick={signInWithGoogle}
                  size="lg"
                />
              </Flex>

              <Flex paddingTop={4} paddingBottom={4} flexDir="row" width="100%" alignItems="center">
                <Divider />
                <Text as="b" paddingStart={4} paddingEnd={4}>
                  or
                </Text>
                <Divider />
              </Flex>

              <Box w="100%">
                <SignUpForm onSubmit={onSubmit} />
              </Box>

              <Box mt={5}>
                <Text fontSize="sm">
                  Already have an account?{' '}
                  <Link textDecoration="underline" textUnderlineOffset={1.5} to="/sign-in" as={RouterLink}>
                    Sign in.
                  </Link>
                </Text>
              </Box>
            </Flex>
          </SoftCard>
        </Box>
      </Flex>
    </DefaultLayout>
  );
};

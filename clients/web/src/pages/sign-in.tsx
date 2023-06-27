import { Flex, Heading, Box, IconButton, Text, Divider, useToast, Link } from '@chakra-ui/react';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { PasswordAuthenticationForm } from '../components/forms';
import { LinkWithQuery } from '../components/generic/LinkWithQuery';
import { SoftCard } from '../components/generic/SoftCard';

import { DefaultLayout } from '../layouts';
import { useAppConfigContext, useAuthContext } from '../providers';

export const SignInPage: React.FC = () => {
  const { signInWithEmailAndPassword, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuthContext();
  const toast = useToast();
  const { config } = useAppConfigContext();

  const onSignIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword({ email, password });
    } catch (err: any) {
      toast({
        title: 'Failed to sign in',
        description: err.message,
        status: 'error',
      });
    }
  };

  return (
    <DefaultLayout displayLogo>
      <Flex width="100%" alignSelf="center" flexGrow={1} justifyContent="center" alignItems="center">
        <Box w={460}>
          <SoftCard>
            <Flex alignItems="center" flexDir="column">
              {Object.values(config.identityProviders).some((val) => val) && (
                <>
                  <Heading mb={2} size="md" paddingBottom={4}>
                    Continue with
                  </Heading>

                  <Flex flexDir="row" justifyContent="center" gap={4}>
                    {config.identityProviders.apple && (
                      <IconButton
                        variant="outline"
                        aria-label="Continue with Apple"
                        icon={<FaApple />}
                        onClick={signInWithApple}
                        size="lg"
                      />
                    )}
                    {config.identityProviders.facebook && (
                      <IconButton
                        variant="outline"
                        aria-label="Continue with Facebook"
                        icon={<FaFacebook />}
                        onClick={signInWithFacebook}
                        size="lg"
                      />
                    )}
                    {config.identityProviders.google && (
                      <IconButton
                        variant="outline"
                        aria-label="Coninue with Google"
                        icon={<FaGoogle />}
                        onClick={signInWithGoogle}
                        size="lg"
                      />
                    )}
                  </Flex>
                  <Flex paddingTop={4} paddingBottom={4} flexDir="row" width="100%" alignItems="center">
                    <Divider />
                    <Text as="b" paddingStart={4} paddingEnd={4}>
                      or
                    </Text>
                    <Divider />
                  </Flex>
                </>
              )}

              <Box w="100%">
                <PasswordAuthenticationForm onSubmit={onSignIn} />
              </Box>

              <Box mt={5}>
                <Text fontSize="sm">
                  New to Volca?{' '}
                  <Link textDecoration="underline" textUnderlineOffset={1.5} to="/sign-up" as={LinkWithQuery}>
                    Create an account.
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

import { Flex, Heading, Box, IconButton, Text, Divider, Link, Card, CardBody } from '@chakra-ui/react';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { PasswordAuthenticationForm } from '../components/forms';
import { LinkWithQuery } from '../components/generic/LinkWithQuery';

import { DefaultLayout } from '../layouts';
import { useAppConfigContext, useAuthContext } from '../providers';
import { useState } from 'react';

export const SignInPage: React.FC = () => {
  const { signInWithEmailAndPassword, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { config } = useAppConfigContext();

  const onSignIn = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    await signInWithEmailAndPassword({ email, password });
    setLoading(false);
  };

  return (
    <DefaultLayout>
      <Flex
        width="100%"
        alignSelf="center"
        flexGrow={1}
        alignItems={{ base: 'flex-start', md: 'center' }}
        marginTop={{ base: 12, md: 0 }}
        justifyContent="center"
      >
        <Box w={460}>
          <Card>
            <CardBody>
              <Flex alignItems="center" flexDir="column">
                {Object.values(config.identityProviders).some((val) => val) ? (
                  <>
                    <Heading mb={2} size="md" paddingBottom={4}>
                      Continue with
                    </Heading>

                    <Flex flexDir="row" justifyContent="center" gap={4}>
                      {config.identityProviders.apple && (
                        <IconButton
                          aria-label="Continue with Apple"
                          icon={<FaApple />}
                          onClick={() => signInWithApple('signIn')}
                          size="lg"
                        />
                      )}
                      {config.identityProviders.facebook && (
                        <IconButton
                          aria-label="Continue with Facebook"
                          icon={<FaFacebook />}
                          onClick={() => signInWithFacebook('signIn')}
                          size="lg"
                        />
                      )}
                      {config.identityProviders.google && (
                        <IconButton
                          aria-label="Coninue with Google"
                          icon={<FaGoogle />}
                          onClick={() => signInWithGoogle('signIn')}
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
                ) : (
                  <Heading mb={4} size="lg" paddingBottom={4}>
                    Sign in
                  </Heading>
                )}

                <Box w="100%">
                  <PasswordAuthenticationForm onSubmit={onSignIn} loading={loading} />
                </Box>

                <Box mt={5}>
                  <Text fontSize="sm">
                    New to Volca?{' '}
                    <Link
                      textDecoration="underline"
                      textUnderlineOffset={1.5}
                      to="/sign-up"
                      as={LinkWithQuery}
                      fontWeight="semibold"
                    >
                      Create an account.
                    </Link>
                  </Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </DefaultLayout>
  );
};

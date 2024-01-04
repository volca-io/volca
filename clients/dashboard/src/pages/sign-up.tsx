import { Flex, Heading, Box, IconButton, Text, Divider, Link, Card, CardBody } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa/index.js';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SignUpForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useAppConfigContext, useAuthContext } from '../providers';

export const SignUpPage: React.FC = () => {
  const { signUpWithEmailAndPassword, signInWithGoogle, signInWithFacebook, signInWithApple } = useAuthContext();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { config } = useAppConfigContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/projects');
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
    setLoading(true);
    await signUpWithEmailAndPassword({ email, password, firstName, lastName });
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
                      Register with
                    </Heading>

                    <Flex flexDir="row" justifyContent="center" gap={4}>
                      {config.identityProviders.apple && (
                        <IconButton
                          aria-label="Continue with Apple"
                          icon={<FaApple />}
                          onClick={() => signInWithApple('signUp')}
                          size="lg"
                        />
                      )}
                      {config.identityProviders.facebook && (
                        <IconButton
                          aria-label="Continue with Facebook"
                          icon={<FaFacebook />}
                          onClick={() => signInWithFacebook('signUp')}
                          size="lg"
                        />
                      )}
                      {config.identityProviders.google && (
                        <IconButton
                          aria-label="Coninue with Google"
                          icon={<FaGoogle />}
                          onClick={() => signInWithGoogle('signUp')}
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
                    Create account
                  </Heading>
                )}

                <Box w="100%">
                  <SignUpForm onSubmit={onSubmit} loading={loading} />
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
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </DefaultLayout>
  );
};

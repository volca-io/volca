import { useState } from 'react';
import { Box, Heading, Text, useColorModeValue, Flex, Link } from '@chakra-ui/react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { RegisterForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';
import { AlertBox } from '../components/generic/AlertBox';

type ErrorDescription = {
  title: string;
  description: string;
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useUserActions();
  const [error, setError] = useState<ErrorDescription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const titleColor = useColorModeValue('teal.400', 'teal.200');
  const textColor = useColorModeValue('gray.600', 'white');
  const linkColor = useColorModeValue('teal.400', 'teal.200');

  const redirectUser = () => {
    const continueUrl = new URLSearchParams(location.search).get('continue');
    navigate(continueUrl || '/');
  };

  const onSubmit = async ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      await register(firstName, lastName, email, password);
      redirectUser();
    } catch (err: unknown) {
      // @ts-ignore
      setError({ title: 'Registration failed', description: err.message });
    }
    setLoading(false);
  };

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
          {' '}
          <Box paddingY="8">
            <Heading color={titleColor}>Lets get you signed up!</Heading>
            <Text fontSize="sm" color={textColor}>
              Enter your details in the form below to create a new account. <br />
              Already have an account?{' '}
              <Link
                color={linkColor}
                textDecoration="underline"
                textUnderlineOffset={1.5}
                to="/sign-in"
                as={RouterLink}
              >
                Sign in instead
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
            <RegisterForm onSubmit={onSubmit} loading={loading} />
          </SoftCard>
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

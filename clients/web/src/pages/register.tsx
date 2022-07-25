import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  CloseButton,
  Link,
} from '@chakra-ui/react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { RegisterForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';

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
      <Flex minH="100vh" direction="column" justifyContent="center" maxW="600px" margin="0 auto">
        <Box paddingY="8">
          <Heading color={titleColor}>Lets get you signed up!</Heading>
          <Text fontSize="sm" color={textColor}>
            Enter your details in the form below to create a new account. Already have an account?{' '}
            <Link color={linkColor} to="/sign-in" as={RouterLink}>
              Sign in instead
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
        <SoftCard>
          <RegisterForm onSubmit={onSubmit} loading={loading} />
        </SoftCard>
      </Flex>
    </DefaultLayout>
  );
};

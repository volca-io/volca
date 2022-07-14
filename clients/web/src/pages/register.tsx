import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  VStack,
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
      <Flex direction="column" p="10" flexGrow={1} justifyContent="center" alignItems="center">
        <VStack spacing="8" w="100%" maxW="600px" alignItems="flex-start">
          <Box>
            <Heading color={titleColor}></Heading>
            <Text fontSize="sm" color={textColor}></Text>
          </Box>
          <Box>
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
          <Box alignSelf="stretch">
            <RegisterForm onSubmit={onSubmit} loading={loading} />
          </Box>
        </VStack>
      </Flex>
    </DefaultLayout>
  );
};

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
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
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
      <Flex flexDirection="column" flex={1} alignItems="center" justifyContent="center">
        <VStack spacing="8" alignItems="flex-start">
          <Box>
            <Heading color={titleColor}>Lets get you signed up!</Heading>
            <Text fontSize="sm" color={textColor}>
              Enter your details in the form below to create a new account.
            </Text>
          </Box>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription>{error.description}</AlertDescription>
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right={-1}
                top={-1}
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

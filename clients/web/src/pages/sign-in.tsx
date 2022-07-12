import { Heading, Box, Text, useColorModeValue } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { SignInForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useUserActions();
  const toast = useToast();

  const titleColor = useColorModeValue('teal.300', 'teal.200');
  const textColor = useColorModeValue('gray.400', 'white');

  const redirectUser = () => {
    const continueUrl = new URLSearchParams(location.search).get('continue');
    navigate(continueUrl || '/test');
  };

  const authnPassword = async ({ email, password }: { email: string; password: string }) => {
    try {
      await signIn(email, password);
      redirectUser();
    } catch (err: unknown) {
      toast({
        title: 'Authentication failed',
        description: '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <DefaultLayout>
      <Box>
        <Heading color={titleColor}>Welcome!</Heading>
        <Text color={textColor}>Enter your e-mail and password to sign in</Text>
        <SignInForm onSubmit={authnPassword} />
      </Box>
    </DefaultLayout>
  );
};

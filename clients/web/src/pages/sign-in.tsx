import { Heading, Box, Text, useColorModeValue } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { SignInForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { useContext } from 'react';
import { UserContext } from '../providers/user-provider';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useContext(UserContext);
  const toast = useToast();

  const titleColor = useColorModeValue('teal.300', 'teal.200');
  const textColor = useColorModeValue('gray.400', 'white');

  const redirectUser = () => {
    const continueUrl = new URLSearchParams(location.search).get('continue');
    navigate(continueUrl || '/test');
  };

  const authnPassword = async ({ email, password }: { email: string; password: string }) => {
    const resp = await ApiClient.authnPassword(email, password);

    if (resp.status === 200) {
      loadUser();
      redirectUser();
    } else {
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

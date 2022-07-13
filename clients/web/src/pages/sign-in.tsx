import { Box, Heading, Text, useColorModeValue, Flex, VStack } from '@chakra-ui/react';
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

  const titleColor = useColorModeValue('teal.400', 'teal.200');
  const textColor = useColorModeValue('gray.600', 'white');

  const redirectUser = () => {
    const continueUrl = new URLSearchParams(location.search).get('continue');
    navigate(continueUrl || '/');
  };

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
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
      <Flex flexDirection="column" flex={1} alignItems="center" justifyContent="center">
        <VStack spacing="8" alignItems="flex-start">
          <Box>
            <Heading color={titleColor}>Welcome!</Heading>
            <Text fontSize="sm" color={textColor}>
              Enter your e-mail and password to sign in
            </Text>
          </Box>
          <Box>
            <SignInForm onSubmit={onSubmit} />
          </Box>
        </VStack>
      </Flex>
    </DefaultLayout>
  );
};

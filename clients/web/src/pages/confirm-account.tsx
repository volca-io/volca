import { Flex, Heading, Box, Text, Link, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PinInputForm } from '../components/forms/PinInputForm';
import { SoftCard } from '../components/generic/SoftCard';

import { DefaultLayout } from '../layouts';
import { useAuthContext } from '../providers';

interface PageState {
  email: string;
}

export const ConfirmAccountPage: React.FC = () => {
  const { confirmSignUp, resendSignUp } = useAuthContext();
  const toast = useToast();
  const location = useLocation();
  const [email, setEmail] = useState('');

  const onSubmit = async ({ code }: { code: string }) => {
    await confirmSignUp({ email, code });
  };

  const onResend = async () => {
    try {
      await resendSignUp({ email });
      toast({
        title: 'Success',
        description: 'A new verification code has been sent',
        status: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Failed to send verification code',
        description: err.message,
        status: 'error',
      });
    }
  };

  useEffect(() => {
    const { state } = location;

    if (!state) {
      return;
    }

    const { email } = state as PageState;
    setEmail(email);

  }, [location]);

  return (
    <DefaultLayout displayLogo>
      <Flex width="100%" alignSelf="center" flexGrow={1} justifyContent="center" alignItems="center">
        <Box w={460}>
          <SoftCard>
            <Flex alignItems="center" flexDir="column">
              <Heading mb={2} size="md">
                Enter verification code
              </Heading>
              <Box paddingTop={2} paddingBottom={2}></Box>
              <Text fontSize="sm">We sent a code to {email}</Text>
              <Box paddingTop={2} paddingBottom={2}></Box>
              <PinInputForm onSubmit={onSubmit} />
              <Box paddingTop={2} paddingBottom={2}></Box>
              <Text fontSize="sm">
                No code? {}
                <Link textDecoration="underline" textUnderlineOffset={1.5} onClick={onResend}>
                  Resend verification email.
                </Link>
              </Text>
            </Flex>
          </SoftCard>
        </Box>
      </Flex>
    </DefaultLayout>
  );
};

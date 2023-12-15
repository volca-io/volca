import { Text, Flex, Box, Heading, Card } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { DefaultLayout } from '../layouts';
import { VerifyResetPasswordForm } from '../components/forms/VerifyResetPasswordForm';
import { useAuthContext } from '../providers';
import { useState } from 'react';

type PageState = {
  email: string;
};

export const VerifyResetPasswordPage: React.FC = () => {
  const { completeResetPassword } = useAuthContext();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { email } = location.state as PageState;

  const onSubmit = async ({ password, code }: { password: string; code: string }) => {
    setLoading(true);
    await completeResetPassword({ email, password, code });
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
          <Box mb={2}>
            <Heading mb={2}>Reset password</Heading>
            <Text fontSize="sm">
              Enter the verification code that was sent to your email and select a new password for your account.
            </Text>
          </Box>

          <Card mt={2}>
            <VerifyResetPasswordForm onSubmit={onSubmit} loading={loading} />
          </Card>
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

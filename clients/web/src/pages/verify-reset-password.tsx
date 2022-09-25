import { Text, Flex, useColorModeValue, Box, Heading, Link } from '@chakra-ui/react';

import { DefaultLayout } from '../layouts';
import { SoftCard } from '../components/generic/SoftCard';
import { useState } from 'react';
import { AlertBox } from '../components/generic/AlertBox';
import { VerifyResetPasswordForm } from '../components/forms/VerifyResetPasswordForm';
import { useUserActions } from '../hooks';
import { Link as RouterLink, useLocation } from 'react-router-dom';

type AlertBody = {
  title: string;
  description: string | React.ReactNode;
  type: 'success' | 'error';
};

export const VerifyResetPasswordPage: React.FC = () => {
  const { verifyResetPassword } = useUserActions();
  const [alert, setAlert] = useState<AlertBody | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const titleColor = useColorModeValue('teal.400', 'teal.200');
  const textColor = useColorModeValue('gray.600', 'white');

  const onSubmit = async ({ password }: { password: string }) => {
    const query = new URLSearchParams(location.search);
    const resetToken = query.get('reset-token');
    if (!resetToken) {
      setAlert({
        title: 'Something went wrong',
        description: (
          <Text>
            Your reset link is invalid. Click{' '}
            <Link textDecoration="underline" textUnderlineOffset={1.5} to="/reset-password" as={RouterLink}>
              here
            </Link>{' '}
            to request a new one.
          </Text>
        ),
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      await verifyResetPassword(password, resetToken);
      setAlert({
        title: 'Success!',
        description: (
          <Text>
            Your password was successfully set. Click{' '}
            <Link textDecoration="underline" textUnderlineOffset={1.5} to="/sign-in" as={RouterLink}>
              here
            </Link>{' '}
            to sign in.
          </Text>
        ),
        type: 'success',
      });
    } catch (err: any) {
      setAlert({
        title: 'Something went wrong',
        description:
          err instanceof Error
            ? err.message
            : 'Something went wrong when processing your request. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout displayLogo>
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
            <Heading color={titleColor} mb={2}>
              Reset password
            </Heading>
            <Text fontSize="sm" color={textColor}>
              Enter a new password in the form below and click submit to change the password on your account.
            </Text>
          </Box>
          {alert && (
            <AlertBox
              title={alert.title}
              description={alert.description}
              onClose={() => setAlert(null)}
              status={alert.type}
            />
          )}
          <SoftCard mt={2}>
            <VerifyResetPasswordForm onSubmit={onSubmit} loading={loading} />
          </SoftCard>
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

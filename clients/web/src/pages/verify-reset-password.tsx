import { Text, Flex, useColorModeValue, Box, Heading, Link } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { DefaultLayout } from '../layouts';
import { SoftCard } from '../components/generic/SoftCard';
import { VerifyResetPasswordForm } from '../components/forms/VerifyResetPasswordForm';
import { useUserActions } from '../hooks';
import { AlertBox } from '../components/generic/AlertBox';

export const VerifyResetPasswordPage: React.FC = () => {
  const { verifyResetPassword } = useUserActions();
  const location = useLocation();
  const resetToken = new URLSearchParams(location.search).get('reset-token');

  const titleColor = useColorModeValue('teal.400', 'teal.200');
  const textColor = useColorModeValue('gray.600', 'white');

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
          {!resetToken && (
            <AlertBox
              title="Invalid link"
              status="warning"
              description={
                <Text>
                  Your reset link is invalid. Click{' '}
                  <Link textDecoration="underline" textUnderlineOffset={1.5} to="/reset-password" as={RouterLink}>
                    here
                  </Link>{' '}
                  to request a new one.
                </Text>
              }
            />
          )}
          {resetToken && (
            <SoftCard mt={2}>
              <VerifyResetPasswordForm
                onSubmit={({ password }) => (resetToken ? verifyResetPassword(password, resetToken) : null)}
              />
            </SoftCard>
          )}
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

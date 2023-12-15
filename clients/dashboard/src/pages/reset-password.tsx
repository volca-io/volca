import { Text, Flex, Box, Heading, Link, Card, CardBody } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import { DefaultLayout } from '../layouts';
import { ResetPasswordForm } from '../components/forms/ResetPasswordForm';
import { useAuthContext } from '../providers';
import { useState } from 'react';

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }: { email: string }) => {
    setLoading(true);
    await resetPassword({ email });
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
            <Heading mb={2}>Reset your password</Heading>
            <Text fontSize="sm">
              Enter the email address you signed up with and we'll send you instructions as how to reset your password.
              Or go back to{' '}
              <Link textDecoration="underline" textUnderlineOffset={1.5} to="/sign-in" as={RouterLink}>
                sign in page
              </Link>
              .
            </Text>
          </Box>
          <Card>
            <CardBody>
              <ResetPasswordForm onSubmit={onSubmit} loading={loading} />
            </CardBody>
          </Card>
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

import { Box, Heading, Text, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { RegisterForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';

export const RegisterPage: React.FC = () => {
  const { register } = useUserActions();

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
  }) => register(firstName, lastName, email, password);

  return (
    <DefaultLayout displayLogo>
      <Flex width="100%" alignSelf="center" flexGrow={1} justifyContent="center">
        <Flex direction="column" justifyContent={{ base: 'flex-start ', md: 'center' }} flexGrow={1} maxW={600}>
          <Box paddingY="8">
            <Heading mb={2}>Let's get you signed up!</Heading>
            <Text fontSize="sm">
              Enter your details in the form below to create a new account. <br />
              Already have an account?{' '}
              <Link textDecoration="underline" textUnderlineOffset={1.5} to="/sign-in" as={RouterLink}>
                Sign in instead
              </Link>
            </Text>
          </Box>
          <SoftCard>
            <RegisterForm onSubmit={onSubmit} />
          </SoftCard>
        </Flex>
      </Flex>
    </DefaultLayout>
  );
};

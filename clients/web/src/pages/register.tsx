import { Box, Heading, Text, useColorModeValue, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { RegisterForm } from '../components/forms';
import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';

export const RegisterPage: React.FC = () => {
  const { register } = useUserActions();

  const titleColor = useColorModeValue('teal.400', 'teal.200');
  const textColor = useColorModeValue('gray.600', 'white');
  const linkColor = useColorModeValue('teal.400', 'teal.200');

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
          <Box paddingY="8">
            <Heading color={titleColor} mb={2}>
              Let's get you signed up!
            </Heading>
            <Text fontSize="sm" color={textColor}>
              Enter your details in the form below to create a new account. <br />
              Already have an account?{' '}
              <Link
                color={linkColor}
                textDecoration="underline"
                textUnderlineOffset={1.5}
                to="/sign-in"
                as={RouterLink}
              >
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

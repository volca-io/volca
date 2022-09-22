import {
  Input,
  Button,
  Text,
  Image,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';
import { useState } from 'react';

type FormValues = {
  email: string;
};

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword } = useUserActions();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await resetPassword(email);
    } catch (err: unknown) {
      setError('Something went wrong');
    }
  };

  return (
    <DefaultLayout>
      <Flex minH="100vh" direction="column" justifyContent="center" maxW="600px" margin="0 auto">
        <Flex paddingY="8" direction="column" alignItems="center">
          <Image src={useColorModeValue('/logo-dark.svg', '/logo-light.svg')} boxSize="128px" />
          <Text fontSize="sm">Enter the e-mail you used to sign up.</Text>
        </Flex>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <CloseButton
              alignSelf="flex-end"
              position="absolute"
              right={0}
              top={0}
              onClick={() => {
                setError(null);
              }}
            />
          </Alert>
        )}
        <SoftCard mt={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input type="email" placeholder="Email" {...register('email', { required: true })} />
            {errors?.email && <p>E-mail is required</p>}
            <Button type="submit" mt={4}>
              Reset password
            </Button>
          </form>
        </SoftCard>
      </Flex>
    </DefaultLayout>
  );
};

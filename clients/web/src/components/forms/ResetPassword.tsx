import { FormControl, FormLabel, Input, Button, FormErrorMessage, VStack } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { loadingState } from '../../state';

interface FormProps {
  email: string;
}

interface SignInFormProps {
  onSubmit: (data: FormProps) => void;
  defaultIdentifier?: string;
  defaultRemember?: boolean | undefined;
}

export const ResetPasswordForm: React.FC<SignInFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();
  const loading = useRecoilValue(loadingState);

  const _onSubmit = ({ email }: FormProps) => {
    onSubmit({
      email: email.toLowerCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <VStack spacing="4">
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="lastName" fontSize="sm">
            Email address
          </FormLabel>
          <Input
            id="email"
            type="email"
            fontSize="sm"
            {...register('email', { required: 'Enter your email', validate: (val) => /.+@.+/.test(val) })}
          />
          {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
        </FormControl>
        <Button
          fontSize="10px"
          type="submit"
          bg="teal.300"
          w="100%"
          h="45"
          mb="20px"
          color="white"
          mt="20px"
          _hover={{
            bg: 'teal.200',
          }}
          _active={{
            bg: 'teal.400',
          }}
          isLoading={loading}
        >
          RESET PASSWORD
        </Button>
      </VStack>
    </form>
  );
};

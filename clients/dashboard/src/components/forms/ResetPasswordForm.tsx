import { FormControl, FormLabel, Input, FormErrorMessage, VStack, Button } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

interface FormProps {
  email: string;
}

interface SignInFormProps {
  onSubmit: (data: FormProps) => void;
  loading: boolean;
}

export const ResetPasswordForm: React.FC<SignInFormProps> = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();

  const _onSubmit = ({ email }: FormProps) => {
    onSubmit({
      email: email.toLowerCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit(_onSubmit)} noValidate>
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
        <Button fontSize="10px" type="submit" w="100%" h="45" mb="20px" mt="20px" isLoading={loading}>
          Reset password
        </Button>
      </VStack>
    </form>
  );
};

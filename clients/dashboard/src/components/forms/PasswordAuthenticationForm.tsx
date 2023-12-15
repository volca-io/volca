import { FormControl, FormLabel, Input, FormErrorMessage, VStack, Flex, Button } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';

interface FormProps {
  email: string;
  password: string;
}

interface PasswordAuthenticationFormProps {
  onSubmit: (data: FormProps) => void;
  loading: boolean;
}

export const PasswordAuthenticationForm: React.FC<PasswordAuthenticationFormProps> = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();

  const _onSubmit = ({ email, password }: FormProps) => {
    
    onSubmit({
      email: email.toLowerCase(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit(_onSubmit)} noValidate>
      <VStack spacing="4">
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email" fontSize="sm">
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
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password" fontSize="sm">
            Password
          </FormLabel>
          <Input
            id="password"
            type="password"
            fontSize="sm"
            autoComplete="current-password"
            {...register('password', { required: 'Enter your password' })}
          />
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>
        <Flex alignSelf="flex-start">
          <Link
            textDecoration="underline"
            textUnderlineOffset={1.5}
            to="/reset-password"
            as={RouterLink}
            fontWeight="semibold"
            fontSize="small"
          >
            Forgot your password?
          </Link>
        </Flex>
        <Button type="submit" w="100%" mb="20px" mt="20px" isLoading={loading}>
          Sign in
        </Button>
      </VStack>
    </form>
  );
};

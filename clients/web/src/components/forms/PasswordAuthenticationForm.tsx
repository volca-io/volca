import { FormControl, FormLabel, Input, Button, FormErrorMessage, VStack, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import { useLoadingContext } from '../../providers';

interface FormProps {
  email: string;
  password: string;
}

interface PasswordAuthenticationFormProps {
  onSubmit: (data: FormProps) => void;
}

export const PasswordAuthenticationForm: React.FC<PasswordAuthenticationFormProps> = ({ onSubmit }) => {
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

  const { loading } = useLoadingContext();

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
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="Password" fontSize="sm">
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
          <Text fontSize="sm">
            <Link textDecoration="underline" textUnderlineOffset={1.5} to="/reset-password" as={RouterLink}>
              Forgot your password?
            </Link>
          </Text>
        </Flex>
        <Button fontSize="10px" type="submit" w="100%" h="45" mb="20px" mt="20px" isLoading={loading}>
          SIGN IN
        </Button>
      </VStack>
    </form>
  );
};

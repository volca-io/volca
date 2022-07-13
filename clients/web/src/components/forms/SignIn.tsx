import { FormControl, FormLabel, Input, Button, Link, useColorModeValue, FormErrorMessage } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import { useForm } from 'react-hook-form';

interface FormProps {
  email: string;
  password: string;
}

interface SignInFormProps {
  onSubmit: (data: FormProps) => void;
  loading: boolean;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, loading }) => {
  const linkColor = useColorModeValue('teal.400', 'teal.200');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
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
            {...register('password', { required: 'Enter your password' })}
          />
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>
        <Link color={linkColor} to="/register" as={RouterLink}>
          Or register an account
        </Link>
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
          SIGN IN
        </Button>
      </FormControl>
    </form>
  );
};

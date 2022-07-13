import { FormControl, FormLabel, Input, Button, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import { useForm } from 'react-hook-form';

interface FormProps {
  email: string;
  password: string;
}

interface SignInFormProps {
  onSubmit: (data: FormProps) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit }) => {
  const linkColor = useColorModeValue('teal.400', 'teal.200');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="email" fontSize="sm">
          Email address
        </FormLabel>
        <Input id="email" type="email" fontSize="sm" {...register('email', { required: true })} />
        <FormLabel htmlFor="Password" fontSize="sm">
          Password
        </FormLabel>
        <Input id="password" type="password" fontSize="sm" {...register('password', { required: true })} />
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
        >
          SIGN IN
        </Button>
      </FormControl>
    </form>
  );
};

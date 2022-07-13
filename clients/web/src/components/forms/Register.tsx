import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  useColorModeValue,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import { useForm } from 'react-hook-form';

interface RegisterFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface OnSubmitProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterFormComponentProps {
  onSubmit: (data: OnSubmitProps) => void;
  loading: boolean;
}

export const RegisterForm: React.FC<RegisterFormComponentProps> = ({ onSubmit, loading }) => {
  const linkColor = useColorModeValue('teal.400', 'teal.200');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormProps>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} alignItems="flex-start">
        <FormControl isInvalid={!!errors.firstName}>
          <FormLabel htmlFor="firstName" fontSize="sm">
            First name
          </FormLabel>
          <Input
            id="firstName"
            type="text"
            fontSize="sm"
            {...register('firstName', { required: 'Enter your first name' })}
          />
          {errors.firstName && <FormErrorMessage>{errors.firstName.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.lastName}>
          <FormLabel htmlFor="lastName" fontSize="sm">
            Last name
          </FormLabel>
          <Input
            id="lastName"
            type="text"
            fontSize="sm"
            {...register('lastName', { required: 'Enter your last name' })}
          />
          {errors.lastName && <FormErrorMessage>{errors.lastName.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="lastName" fontSize="sm">
            Email address
          </FormLabel>
          <Input id="email" type="email" fontSize="sm" {...register('email', { required: 'Enter your email' })} />
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
        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel htmlFor="Password" fontSize="sm">
            Confirm password
          </FormLabel>
          <Input
            id="conformPassword"
            type="password"
            fontSize="sm"
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (val: string) => {
                if (watch('password') !== val) {
                  return 'Your passwords does not match';
                }
              },
            })}
          />
          {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
        </FormControl>
        <Link color={linkColor} to="/sign-in" as={RouterLink}>
          Already have an account?
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
          REGISTER
        </Button>
      </VStack>
    </form>
  );
};

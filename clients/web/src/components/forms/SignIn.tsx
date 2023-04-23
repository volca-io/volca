import { FormControl, FormLabel, Input, Button, Switch, FormErrorMessage, VStack } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { loadingState } from '../../state';

interface FormProps {
  email: string;
  password: string;
  remember: boolean;
}

interface SignInFormProps {
  onSubmit: (data: FormProps) => void;
  defaultIdentifier?: string;
  defaultRemember?: boolean | undefined;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, defaultIdentifier, defaultRemember }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    defaultValues: {
      email: defaultIdentifier,
      password: undefined,
      remember: defaultRemember === undefined ? true : defaultRemember,
    },
  });

  const _onSubmit = ({ email, password, remember }: FormProps) => {
    onSubmit({
      email: email.toLowerCase(),
      password,
      remember,
    });
  };

  const loading = useRecoilValue(loadingState);

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
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="remember" fontSize="sm" mb="0">
            Remember me
          </FormLabel>
          <Switch id="remember" {...register('remember')} />
        </FormControl>
        <Button fontSize="10px" type="submit" w="100%" h="45" mb="20px" mt="20px" isLoading={loading}>
          SIGN IN
        </Button>
      </VStack>
    </form>
  );
};

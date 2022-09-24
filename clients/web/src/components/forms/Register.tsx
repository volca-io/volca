import React, { useEffect } from 'react';
import { useState } from 'react';
import { FormControl, FormLabel, Input, Button, VStack, FormErrorMessage, Progress, HStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

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

type PasswordStrengthColorMap = {
  [key: number]: 'gray' | 'red' | 'yellow' | 'green';
};

const passwordStrengthColorMap = {
  0: 'red',
  1: 'red',
  2: 'yellow',
  3: 'green',
  4: 'green',
} as PasswordStrengthColorMap;

export const RegisterForm: React.FC<RegisterFormComponentProps> = ({ onSubmit, loading }) => {
  const [strengthCheck, setStrengthCheck] = useState<null | ZXCVBNResult>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormProps>();

  const password = watch('password');
  useEffect(() => {
    const result = password ? zxcvbn(password) : null;
    setStrengthCheck(result);
  }, [password]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} alignItems="flex-start">
        <HStack alignSelf="stretch">
          <FormControl isInvalid={!!errors.firstName} minW={100}>
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
          <FormControl isInvalid={!!errors.lastName} minW={100}>
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
        </HStack>

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
            {...register('password', {
              required: 'Enter your password',
              validate: () => {
                if ((strengthCheck?.score || 0) < 2) {
                  return `Choose a stronger password. ${strengthCheck?.feedback.warning}`;
                }
              },
            })}
          />
          <Progress
            size="sm"
            value={strengthCheck?.score === undefined ? 0 : strengthCheck?.score + 1}
            max={5}
            min={0}
            borderRadius={5}
            mt={2}
            colorScheme={passwordStrengthColorMap[strengthCheck?.score || 0]}
            sx={{
              '& > div:first-child': {
                transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
                transitionDuration: '.2s, .2s, .35s',
                transitionProperty: 'width',
                transitionTimingFunction: 'linear, linear, ease',
              },
            }}
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

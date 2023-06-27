import { FormControl, FormLabel, Input, Button, FormErrorMessage, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

import { PasswordStrengthIndicator } from '../PasswordStrength';
import { useLoadingContext } from '../../providers';

interface FormProps {
  code: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  onSubmit: (data: Omit<FormProps, 'confirmPassword'>) => void;
}

export const VerifyResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const [strengthCheck, setStrengthCheck] = useState<null | ZXCVBNResult>(null);
  const { loading } = useLoadingContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormProps>();

  const password = watch('password');
  useEffect(() => {
    const result = password ? zxcvbn(password) : null;
    setStrengthCheck(result);
  }, [password]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} alignItems="flex-start">
        <FormControl isInvalid={!!errors.code}>
          <FormLabel htmlFor="code" fontSize="sm">
            Verification code
          </FormLabel>
          <Input
            id="code"
            fontSize="sm"
            {...register('code', {
              required: 'Enter your verification code',
            })}
          />
          {errors.code && <FormErrorMessage>{errors.code.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="lastName" fontSize="sm">
            New password
          </FormLabel>
          <Input
            id="password"
            type="password"
            fontSize="sm"
            {...register('password', {
              required: 'Enter a new password',
              validate: () => {
                if ((strengthCheck?.score || 0) < 2) {
                  return `Choose a stronger password. ${strengthCheck?.feedback.warning}`;
                }
              },
            })}
          />
          <PasswordStrengthIndicator strength={strengthCheck?.score} />
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel htmlFor="lastName" fontSize="sm">
            Confirm password
          </FormLabel>
          <Input
            id="confirm-password"
            type="password"
            fontSize="sm"
            {...register('confirmPassword', {
              required: 'Confirm your new password',
              validate: (val: string) => {
                if (watch('password') !== val) {
                  return 'Your passwords does not match';
                }
              },
            })}
          />
          {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
        </FormControl>
        <Button fontSize="10px" type="submit" w="100%" h="45" mb="20px" mt="20px" isLoading={loading}>
          SET NEW PASSWORD
        </Button>
      </VStack>
    </form>
  );
};

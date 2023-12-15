import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, FormErrorMessage, FormLabel, Select, VStack } from '@chakra-ui/react';

import { FileInput } from './inputs/FileInput';

interface FormProps {
  key: string;
  level: 'public' | 'protected' | 'private';
}

type StorageLevel = 'public' | 'protected' | 'private';

interface ResetPasswordFormProps {
  onSubmit: (data: FormProps) => void;
}

export const FileUploadForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormProps>();
  const [level, setLevel] = useState<StorageLevel>('public');

  const _onSubmit = ({ key, level }: FormProps) => {
    onSubmit({ key, level });
  };

  return (
    <form noValidate>
      <VStack>
        <FormControl isInvalid={!!errors.level} isRequired>
          <FormLabel>Level</FormLabel>
          <Select
            {...register('level', { required: 'Please select a level' })}
            onChange={(e) => {
              setLevel(e.target.value as StorageLevel);
            }}
            value={level}
          >
            <option value="public">public</option>
            <option value="protected">protected</option>
            <option value="private">private</option>
          </Select>
          <FormErrorMessage>{errors.level?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.key}>
          <FormLabel>File</FormLabel>
          <Controller
            control={control}
            name="key"
            render={({ field: { onChange } }) => (
              <FileInput
                description="Your file will be uploaded to the cloud"
                level={level}
                onUpload={({ key }) => {
                  onChange(key);
                  handleSubmit(_onSubmit)();
                }}
              />
            )}
          />
          <FormErrorMessage>{errors.key?.message}</FormErrorMessage>
        </FormControl>
      </VStack>
    </form>
  );
};

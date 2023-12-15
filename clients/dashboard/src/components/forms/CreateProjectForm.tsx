import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdChevronRight } from 'react-icons/md';

export type FormValues = {
  name: string;
  country: string;
  address: {
    street: string;
    zipCode: string;
    city: string;
    state?: string;
  };
};

interface ProjectFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
}

export const CreateProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, isLoading }) => {
  const { ...methods } = useForm<FormValues>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Flex gap={4} flexDir="column">
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel htmlFor="name" fontSize="sm">
              Name
            </FormLabel>
            <Input
              id="name"
              placeholder="Enter your project name"
              {...register('name', { required: 'Enter a name' })}
            />
            {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
          </FormControl>

          <Box>
            <Button rightIcon={<MdChevronRight />} type="submit" mt={4} isLoading={isLoading}>
              Continue
            </Button>
          </Box>
        </Flex>
      </form>
    </FormProvider>
  );
};

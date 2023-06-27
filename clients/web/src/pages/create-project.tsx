import React from 'react';
import { Input, Button, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { AuthenticatedLayout } from '../layouts';
import { MdAdd, MdChevronRight } from 'react-icons/md';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { useProjectActions } from '../hooks';

type FormValues = {
  name: string;
};

export const CreateProjectPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { createProject } = useProjectActions();

  const onSubmit = async ({ name }: { name: string }) => {
    await createProject({ name });
  };

  return (
    <AuthenticatedLayout sidebar={false}>
      <PageHeading title="Create Project" icon={MdAdd} />
      <SoftCard>
        <Text fontSize="lg" mb={4}>
          Let's start with a name for your project.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input size={'lg'} placeholder="Enter your project name" {...register('name', { required: true })} />
          {errors?.name && <p>Name is required</p>}
          <Button size="lg" rightIcon={<MdChevronRight />} type="submit" mt={4}>
            Continue
          </Button>
        </form>
      </SoftCard>
    </AuthenticatedLayout>
  );
};

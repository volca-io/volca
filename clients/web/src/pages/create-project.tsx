import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Text, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { currentUserState } from '../state';
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
  const navigate = useNavigate();

  const user = useRecoilValue(currentUserState);

  const { createProject } = useProjectActions();

  useEffect(() => {
    if (!user?.has_active_subscription) {
      navigate('/subscribe');
    }
  }, [user, navigate]);

  const onSubmit = async ({ name }: { name: string }) => {
    await createProject({ name });
    navigate('/');
  };

  return (
    <AuthenticatedLayout sidebar={false}>
      <PageHeading title="Create Project" icon={MdAdd} />
      <Box mt={8} />
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

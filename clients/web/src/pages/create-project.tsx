import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Text, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { selectedProject, currentUser, projects as projectsState } from '../state';
import { MdAdd, MdChevronRight } from 'react-icons/md';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';

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
  const [projects, setProjects] = useRecoilState(projectsState);
  const [, setSelectedProject] = useRecoilState(selectedProject);
  const user = useRecoilValue(currentUser);

  useEffect(() => {
    if (user && !user.has_active_subscription) {
      navigate('/subscribe');
    }
  }, [user, navigate]);

  const onSubmit = async ({ name }: { name: string }) => {
    try {
      const res = await ApiClient.createProject({ name });
      setProjects([...projects, res]);
      setSelectedProject(res);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
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

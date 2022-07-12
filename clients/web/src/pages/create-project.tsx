import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormLabel, Heading, Input, Button, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { currentProject, projects as projectsState } from '../state';

type FormValues = {
  name: string;
};

export const CreateProject: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const [projects, setProjects] = useRecoilState(projectsState);
  const [, setCurrentProject] = useRecoilState(currentProject);

  const onSubmit = async ({ name }: { name: string }) => {
    try {
      const res = await ApiClient.createProject({ name });
      setProjects([...projects, res]);
      setCurrentProject(res);
      navigate('/projects');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Heading>Create Project</Heading>
      <Text>
        To get started using SaaS Boilerplate, you need to create a project. Give your project a name and hit "Go!".
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input {...register('name', { required: true })} />
        {errors?.name && <p>Name is required</p>}
        <Button type="submit" marginTop="1em">
          Go!
        </Button>
      </form>
    </AuthenticatedLayout>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormLabel, Heading, Input, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { Project } from '../types';

type FormValues = {
  name: string;
};

export const ProjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [project, setProject] = useState(null as Project | null);
  const { id } = useParams();

  useEffect(() => {
    const getProjects = async () => {
      if (id) {
        const data = await ApiClient.getProject(id);
        setProject(data);
      }
    };
    getProjects();
  }, [id]);

  if (!id) return null;

  const onSubmit = async (data: { name: string }) => {
    try {
      const updatedProject = await ApiClient.updateProject({ ...data, id });
      setProject(updatedProject);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteProject = async () => {
    try {
      await ApiClient.deleteProject(id);
      navigate('/projects');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthenticatedLayout>
      {project && (
        <>
          <Heading>{project.name}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input defaultValue={project.name} {...register('name', { required: true })} />
            {errors?.name && <p>Name is required</p>}
            <Button marginTop="1em" type="submit" colorScheme={'blue'}>
              Save
            </Button>
            <Button onClick={onDeleteProject} marginTop="1em" marginLeft="1em" colorScheme={'red'}>
              Delete
            </Button>
          </form>
        </>
      )}
    </AuthenticatedLayout>
  );
};

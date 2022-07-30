import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormLabel, Heading, Input, Button, Spacer } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { projects as projectsState } from '../state';
import { ApiClient } from '../lib/clients/api-client';
import { Project } from '../types';
import { PageHeading } from '../components/generic/PageHeading';
import { MdSettings } from 'react-icons/md';
import { SoftCard } from '../components/generic/SoftCard';
import { DangerButton } from '../components/generic/DangerButton';

type FormValues = {
  name: string;
};

export const ProjectSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [project, setProject] = useState<Project>();
  const [projects, setProjects] = useRecoilState(projectsState);
  const { id } = useParams();

  useEffect(() => {
    const getProject = async () => {
      try {
        if (id) {
          const data = await ApiClient.getProject(id);
          setProject(data);
        }
      } catch (err: unknown) {
        console.error(err);
        navigate('/projects');
      }
    };
    getProject();
  }, [id, navigate]);

  if (!id) return null;

  const onSubmit = async (data: { name: string }) => {
    try {
      const updatedProject = await ApiClient.updateProject({ ...data, id });
      setProject(updatedProject);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteProject = async () => {
    try {
      await ApiClient.deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
      navigate('/projects');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticatedLayout>
      {project && (
        <SoftCard>
          <PageHeading title="Settings" icon={MdSettings} />
          <Spacer mt={6} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input defaultValue={project.name} {...register('name', { required: true })} />
            {errors?.name && <p>Name is required</p>}
            <Button marginTop="1em" type="submit" colorScheme="blue">
              Save
            </Button>
          </form>
          <Heading as="h2" size="md" style={{ marginTop: '1em', marginBottom: '1em' }}>
            Manage
          </Heading>
          <DangerButton
            onClick={onDeleteProject}
            title={'Delete Project'}
            body={'Are you sure you want to delete this project?'}
          />
        </SoftCard>
      )}
    </AuthenticatedLayout>
  );
};

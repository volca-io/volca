import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormLabel, Heading, Input, Button, Spacer } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdSettings } from 'react-icons/md';
import { useRecoilRefresher_UNSTABLE } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { useApiActions } from '../hooks/api-actions';
import { Project } from '../types';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { DangerButton } from '../components/generic/DangerButton';
import { currentProject, projects } from '../state';

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
  const clearProjectsCache = useRecoilRefresher_UNSTABLE(projects);
  const clearCurrentProjectCache = useRecoilRefresher_UNSTABLE(currentProject);

  const refreshProjects = () => {
    clearProjectsCache();
    clearCurrentProjectCache();
  };

  const { executeApiCall } = useApiActions();
  const { id } = useParams();

  useEffect(() => {
    const getProject = async () => {
      if (id) {
        const data = await executeApiCall<Project>({
          action: () => ApiClient.getProject(id),
          onError: () => navigate('/projects'),
          errorMessage: 'Failed to get project. Refresh to try again.',
        });
        if (data) setProject(data);
      }
    };
    getProject();
  }, [id, navigate, executeApiCall]);

  if (!id) return null;

  const onUpdateProject = (data: { name: string }) =>
    executeApiCall({
      action: () => ApiClient.updateProject({ ...data, id }),
      onSuccess: () => refreshProjects(),
      errorMessage: 'Failed to update project',
      successMessage: 'Successfully updated project',
    });

  const onDeleteProject = () =>
    executeApiCall({
      action: () => ApiClient.deleteProject(id),
      onSuccess: () => {
        refreshProjects();
        navigate('/projects');
      },
      errorMessage: 'Failed to delete project',
      successMessage: 'Successfully deleted project',
    });

  return (
    <AuthenticatedLayout>
      {project && (
        <SoftCard>
          <PageHeading title="Settings" icon={MdSettings} />
          <Spacer mt={6} />
          <form onSubmit={handleSubmit(onUpdateProject)}>
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

import React from 'react';
import { Card, CardBody, useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiActions } from '../hooks/api-actions';
import { Project } from '../types';
import { useProjectContext } from '../providers';

import { CreateProjectForm, FormValues } from '../components/forms/CreateProjectForm';

export const CreateProjectPage: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { createApiAction } = useApiActions();
  const { setSelectedProject } = useProjectContext();

  const { mutate: createProject, isLoading } = useMutation({
    mutationFn: (body: FormValues) =>
      createApiAction(async ({ client }) => {
        const { project } = await client.post('projects', { json: body }).json<{ project: Project }>();
        return project;
      }),
    onError: () => {
      toast({ status: 'error', title: 'Failed to create project' });
    },
    onSuccess: (data) => {
      if (!data) return;

      const oldProjects = queryClient.getQueryData<Project[]>(['projects']) || [];
      queryClient.setQueryData(['projects'], [...oldProjects, data]);

      setSelectedProject(data);
    },
  });

  const onSubmit = async (body: FormValues) => {
    createProject(body);
  };

  return (
    <Card>
      <CardBody>
        <CreateProjectForm onSubmit={onSubmit} isLoading={isLoading} />
      </CardBody>
    </Card>
  );
};

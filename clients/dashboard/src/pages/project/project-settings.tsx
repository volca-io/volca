import React from 'react';
import {
  FormLabel,
  Heading,
  Input,
  Box,
  Flex,
  Text,
  FormControl,
  FormErrorMessage,
  Card,
  CardBody,
  CardFooter,
  useToast,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdDelete } from 'react-icons/md';
import _ from 'lodash';

import { Project } from '../../types';
import { ConfirmationButton } from '../../components/generic/ConfirmationButton';
import { Entity, Operation, usePrivileges } from '../../hooks/roles';
import { PrivilegeContainer } from '../../components/generic/PrivilegeContainer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiActions } from '../../hooks/api-actions';
import { useProjectContext } from '../../providers';

type FormValues = {
  name: string;
};

export const ProjectSettingsPage: React.FC = () => {
  const { selectedProject } = useProjectContext();
  const { createApiAction } = useApiActions();
  const toast = useToast();
  const privileges = usePrivileges();
  const queryClient = useQueryClient();

  const { mutate: updateProject, isLoading: updateLoading } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      createApiAction(async ({ client }) =>
        client.put(`projects/${id}`, { json: { ...data } }).json<{ project: Project }>()
      ),
    onError: () => {
      toast({ status: 'error', title: 'Failed to update project' });
    },
    onSuccess: (data, { id }) => {
      toast({ status: 'success', title: 'Project saved' });
      queryClient.invalidateQueries(['projects', id]);
    },
  });

  const { mutate: deleteProject, isLoading: deleteLoading } = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      createApiAction(async ({ client }) => client.delete(`projects/${id}`).json<{ project: Project }>()),
    onError: () => {
      toast({ status: 'error', title: 'Failed to delete project' });
    },
    onSuccess: () => {
      toast({ status: 'success', title: 'Project deleted' });
      queryClient.invalidateQueries(['projects']);
    },
  });

  const { ...methods } = useForm<FormValues>(selectedProject ? { values: _.pick(selectedProject, 'name') } : undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  if (!selectedProject) return null;

  const onUpdateProject = (data: FormValues) => updateProject({ id: selectedProject.id, data });
  const onDeleteProject = () => deleteProject({ id: selectedProject.id });

  return (
    <Flex flexDirection="column" gap={4}>
      <Box>
        <Heading as="h2" size="md" mb={4}>
          Settings
        </Heading>

        <Card>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onUpdateProject)} noValidate>
              <CardBody>
                <Flex flexDirection="column" gap={4}>
                  <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                      disabled={!privileges.PROJECTS.UPDATE}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
                  </FormControl>
                </Flex>
              </CardBody>
              <CardFooter>
                <PrivilegeContainer entity={Entity.PROJECTS} operation={Operation.UPDATE}>
                  <Button type="submit" isLoading={updateLoading}>
                    Save
                  </Button>
                </PrivilegeContainer>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </Box>

      <PrivilegeContainer entity={Entity.PROJECTS} operation={Operation.DELETE}>
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Danger zone
          </Heading>
          <Card>
            <CardBody>
              <Flex justifyContent="space-between" gap={2} alignItems="center">
                <Box>
                  <Heading as="h3" size="sm" mb={2}>
                    Delete project
                  </Heading>
                  <Text>Once you delete a proeject, there is no going back. Please be certain.</Text>
                </Box>

                <ConfirmationButton
                  onConfirm={onDeleteProject}
                  title="Delete"
                  description="Are you sure you want to delete this project?"
                  isLoading={deleteLoading}
                  triggerElement={<IconButton aria-label="Delete project" icon={<MdDelete />} colorScheme="red" />}
                />
              </Flex>
            </CardBody>
          </Card>
        </Box>
      </PrivilegeContainer>
    </Flex>
  );
};

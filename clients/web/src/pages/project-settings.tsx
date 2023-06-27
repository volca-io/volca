import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormLabel, Heading, Input, Button, Box, Badge, SimpleGrid, Flex, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdSettings } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { Project } from '../types';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { DangerButton } from '../components/generic/DangerButton';
import { useProjectActions } from '../hooks/project-actions';
import { useProjectsContext } from '../providers';
import { Entity, Operation, usePrivileges } from '../hooks/roles';
import { PrivilegeContainer } from '../components/generic/PrivilegeContainer';

type FormValues = {
  name: string;
};

export const ProjectSettingsPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { selectedProject } = useProjectsContext();
  const privileges = usePrivileges();
  const [project] = useState<Project | null>(selectedProject);

  const { updateProject, deleteProject } = useProjectActions();
  const { id } = useParams();

  if (!id) return null;

  const onUpdateProject = (data: { name: string }) => updateProject({ ...data, id });

  const onDeleteProject = () => deleteProject(id);

  return (
    <AuthenticatedLayout>
      <PageHeading title="Project Settings" icon={MdSettings} />

      {project && (
        <SimpleGrid pt={2} minChildWidth="400px" width="100%" spacingX="40px" spacingY="20px">
          <Box>
            <Heading as="h2" size="md" mb={4}>
              Settings
            </Heading>

            <SoftCard>
              <Box>
                <form onSubmit={handleSubmit(onUpdateProject)}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    disabled={!privileges.PROJECTS.UPDATE}
                    defaultValue={project.name}
                    {...register('name', { required: true })}
                  />
                  {errors?.name && <p>Name is required</p>}
                  <PrivilegeContainer entity={Entity.PROJECTS} operation={Operation.UPDATE}>
                    <Button marginTop="1em" type="submit">
                      Save
                    </Button>
                  </PrivilegeContainer>
                </form>
              </Box>
            </SoftCard>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={4}>
              Project info
            </Heading>

            <SoftCard>
              <Flex justifyContent="space-between" gap={2} alignItems="center" mt={4}>
                <Box>
                  <Heading as="h3" size="sm" mb={2}>
                    Plan
                  </Heading>
                  <Text>Your current plan. The owner of the project can change plan in their user settings.</Text>
                </Box>
                <Badge fontSize="medium">{project.owner.planId}</Badge>
              </Flex>
            </SoftCard>
          </Box>

          <PrivilegeContainer entity={Entity.PROJECTS} operation={Operation.DELETE}>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Danger zone
              </Heading>
              <SoftCard>
                <Flex justifyContent="space-between" gap={2} alignItems="center">
                  <Box>
                    <Heading as="h3" size="sm" mb={2}>
                      Delete project
                    </Heading>
                    <Text>Once you delete a proeject, there is no going back. Please be certain.</Text>
                  </Box>

                  <DangerButton
                    onClick={onDeleteProject}
                    title={'Delete'}
                    body={'Are you sure you want to delete this project?'}
                  />
                </Flex>
              </SoftCard>
            </Box>
          </PrivilegeContainer>
        </SimpleGrid>
      )}
    </AuthenticatedLayout>
  );
};

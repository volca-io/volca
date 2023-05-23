import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormLabel, Heading, Input, Button, Spacer, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdSettings } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { Project } from '../types';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { DangerButton } from '../components/generic/DangerButton';
import { useProjectActions } from '../hooks/project-actions';
import { selectedProjectSelector } from '../state';
import { useRecoilValue } from 'recoil';
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
  const selectedProject = useRecoilValue(selectedProjectSelector);
  const privileges = usePrivileges();
  const [project] = useState<Project | null>(selectedProject);

  const { updateProject, deleteProject } = useProjectActions();
  const { id } = useParams();

  if (!id) return null;

  const onUpdateProject = (data: { name: string }) => updateProject({ ...data, id });

  const onDeleteProject = () => deleteProject(id);

  return (
    <AuthenticatedLayout>
      {project && (
        <SoftCard>
          <PageHeading title="Settings" icon={MdSettings} />
          <Spacer mt={6} />
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
          <Heading as="h2" size="md" style={{ marginTop: '1em', marginBottom: '1em' }}>
            Plan
          </Heading>
          {project.owner.plan_id}

          <PrivilegeContainer entity={Entity.PROJECTS} operation={Operation.DELETE}>
            <Heading as="h2" size="md" style={{ marginTop: '1em', marginBottom: '1em' }}>
              Manage
            </Heading>
            <Box>
              <DangerButton
                onClick={onDeleteProject}
                title={'Delete'}
                body={'Are you sure you want to delete this project?'}
              />
            </Box>
          </PrivilegeContainer>
        </SoftCard>
      )}
    </AuthenticatedLayout>
  );
};

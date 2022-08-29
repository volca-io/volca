import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormLabel, Heading, Input, Button, Spacer } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdSettings } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { Project } from '../types';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { DangerButton } from '../components/generic/DangerButton';
import { useProjectActions } from '../hooks/project-actions';

type FormValues = {
  name: string;
};

export const ProjectSettingsPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [project, setProject] = useState<Project>();

  const { getProject, updateProject, deleteProject } = useProjectActions();
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await getProject(id);
        if (data) setProject(data);
      }
    };
    load();
  }, [id, getProject]);

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

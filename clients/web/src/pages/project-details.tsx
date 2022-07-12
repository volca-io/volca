import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormLabel, Heading, Input, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { ProjectUserList } from '../components/project-users';
import { Alert, Project, User } from '../types';
import InviteProjectUser from '../components/project-users/InviteProjectUser';

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
  const [project, setProject] = useState<Project>();
  const [inviteAlert, setInviteAlert] = useState<Alert>();
  const [users, setUsers] = useState<User[]>([]);
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

  useEffect(() => {
    const getUsers = async () => {
      if (id) {
        const data = await ApiClient.getProjectUsers(id);
        setUsers(data);
      }
    };
    getUsers();
  }, [id]);

  if (!id) return null;

  const onSubmit = async (data: { name: string }) => {
    try {
      const updatedProject = await ApiClient.updateProject({ ...data, id });
      setProject(updatedProject);
    } catch (error) {
      console.error(error);
    }
  };

  const onInvite = async (data: { toUserEmail: string }) => {
    try {
      const projectInvitation = await ApiClient.createProjectInvitation({ ...data, projectId: id });
      setInviteAlert({
        title: 'User invited!',
        message: `Share the link /${projectInvitation.key} with the user you invited. The link is valid for 1 hour.`,
        status: 'info',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteProject = async () => {
    try {
      await ApiClient.deleteProject(id);
      navigate('/projects');
    } catch (error) {
      console.error(error);
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
          </form>
          <Heading as="h2" size="md" marginTop={'4em'}>
            Users
          </Heading>
          {users && <ProjectUserList project={project} users={users} />}
          <InviteProjectUser alert={inviteAlert} onSubmit={onInvite} />
          <Heading as="h2" size="md">
            Manage
          </Heading>
          <Button onClick={onDeleteProject} marginTop="1em" marginLeft="1em" colorScheme={'red'}>
            Delete
          </Button>
        </>
      )}
    </AuthenticatedLayout>
  );
};

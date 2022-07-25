import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { ProjectUserList } from '../components/project-users';
import { Alert, Project, User } from '../types';
import InviteProjectUser from '../components/project-users/InviteProjectUser';
import { SoftCard } from '../components/generic/SoftCard';
import { MdGroups } from 'react-icons/md';
import { PageHeading } from '../components/generic/PageHeading';

export const ProjectUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>();
  const [inviteAlert, setInviteAlert] = useState<Alert>();
  const [users, setUsers] = useState<User[]>([]);
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

  return (
    <AuthenticatedLayout>
      {project && (
        <SoftCard>
          <Flex alignItems="center" justifyContent="space-between">
            <PageHeading title="Users" icon={MdGroups} />
            <InviteProjectUser alert={inviteAlert} onSubmit={onInvite} />
          </Flex>
          {users && <ProjectUserList project={project} users={users} />}
        </SoftCard>
      )}
    </AuthenticatedLayout>
  );
};

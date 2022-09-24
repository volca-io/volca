import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { MdGroups } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { ProjectUserList } from '../components/project-users';
import { Alert, User } from '../types';
import InviteProjectUser from '../components/project-users/InviteProjectUser';
import { SoftCard } from '../components/generic/SoftCard';
import { PageHeading } from '../components/generic/PageHeading';
import { selectedProject } from '../state';
import { useProjectUserActions } from '../hooks/project-user-actions';

export const ProjectUsersPage: React.FC = () => {
  const project = useRecoilValue(selectedProject);
  const [inviteAlert, setInviteAlert] = useState<Alert>();
  const [users, setUsers] = useState<User[]>([]);
  const { createProjectInvitation, deleteProjectUser } = useProjectUserActions();

  useEffect(() => {
    const getUsers = async () => {
      if (project) {
        const data = await ApiClient.getProjectUsers(project.id);
        setUsers(data);
      }
    };
    getUsers();
  }, [project]);

  if (!project) return null;

  const onInvite = async (data: { toUserEmail: string }) => {
    const projectInvitation = await createProjectInvitation({ ...data, projectId: project.id });
    if (projectInvitation) {
      setInviteAlert({
        title: 'User invited!',
        message: `Share the link ${window.location.protocol}//${window.location.host}/invitations/${projectInvitation.key} with the user you invited. The link is valid for 1 hour.`,
        status: 'info',
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <SoftCard w="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <PageHeading title="Users" icon={MdGroups} />
          <InviteProjectUser alert={inviteAlert} onSubmit={onInvite} />
        </Flex>
        {users && (
          <ProjectUserList
            project={project}
            users={users}
            deleteUser={async (projectId: string, userId: string) => {
              await deleteProjectUser(projectId, userId);
              setUsers(users.filter((u) => u.id !== userId));
            }}
          />
        )}
      </SoftCard>
    </AuthenticatedLayout>
  );
};

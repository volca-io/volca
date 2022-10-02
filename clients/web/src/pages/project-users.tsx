import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { MdGroups } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { ProjectUserList } from '../components/project-users';
import { User } from '../types';
import { InviteProjectUser } from '../components/project-users/InviteProjectUser';
import { SoftCard } from '../components/generic/SoftCard';
import { PageHeading } from '../components/generic/PageHeading';
import { selectedProjectState } from '../state';
import { useProjectUserActions } from '../hooks/project-user-actions';
import { AlertBox, AlertBoxProps } from '../components/generic/AlertBox';

export const ProjectUsersPage: React.FC = () => {
  const project = useRecoilValue(selectedProjectState);
  const [inviteAlert, setInviteAlert] = useState<AlertBoxProps | null>();
  const [users, setUsers] = useState<User[]>([]);
  const { getProjectUsers, createProjectInvitation, deleteProjectUser } = useProjectUserActions();

  useEffect(() => {
    const getUsers = async () => {
      if (project) {
        const data = await getProjectUsers(project.id);
        setUsers(data || []);
      }
    };
    getUsers();
  }, [project, getProjectUsers]);

  if (!project) return null;

  const onInvite = async (data: { toUserEmail: string }) => {
    const projectInvitation = await createProjectInvitation({ ...data, projectId: project.id });
    if (projectInvitation) {
      setInviteAlert({
        title: 'User invited!',
        description: `Share the link ${window.location.protocol}//${window.location.host}/invitations/${projectInvitation.key} with the user you invited. The link is valid for 1 hour.`,
        status: 'info',
        onClose: () => setInviteAlert(null),
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <SoftCard w="100%">
        {inviteAlert && <AlertBox {...inviteAlert} />}
        <Flex alignItems="center" justifyContent="space-between">
          <PageHeading title="Users" icon={MdGroups} />

          <InviteProjectUser onSubmit={onInvite} />
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

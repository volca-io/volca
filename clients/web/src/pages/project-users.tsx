import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton, Code, Text } from '@chakra-ui/react';
import { MdGroups } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { ProjectUserList } from '../components/project-users';
import { User } from '../types';
import { InviteProjectUser } from '../components/project-users/InviteProjectUser';
import { SoftCard } from '../components/generic/SoftCard';
import { PageHeading } from '../components/generic/PageHeading';
import { useProjectUserActions } from '../hooks/project-user-actions';
import { useProjectsContext } from '../providers';

export const ProjectUsersPage: React.FC = () => {
  const { selectedProject: project } = useProjectsContext();
  const [inviteLink, setInviteLink] = useState<string>();
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

  const onInvite = async () => {
    const projectInvitation = await createProjectInvitation({ projectId: project.id });
    if (projectInvitation) {
      setInviteLink(`${window.location.protocol}//${window.location.host}/invitations/${projectInvitation.id}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <PageHeading title="Users" icon={MdGroups} cta={<InviteProjectUser onSubmit={onInvite} />} />
      {inviteLink && (
        <Alert status="success" mb={4}>
          <AlertIcon />
          <Box w="full">
            <Box>
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Share the following one time link with the user you want to invite. The link is valid for one hour.
              </AlertDescription>
            </Box>
            <Box>
              <Code>
                <Text wordBreak="break-all">{inviteLink}</Text>
              </Code>
            </Box>
          </Box>

          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={() => {
              setInviteLink('');
            }}
          />
        </Alert>
      )}
      <SoftCard>
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

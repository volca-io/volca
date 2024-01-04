import React, { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  CloseButton,
  Code,
  Heading,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { MdDelete, MdPersonAdd } from 'react-icons/md/index.js';

import { ProjectInvitation, User } from '../../types';
import { PaginatedTable } from '../../components/generic/PaginatedTable';
import { ConfirmationButton } from '../../components/generic/ConfirmationButton';
import { Entity, Operation, usePrivileges } from '../../hooks/roles';
import { useApiActions } from '../../hooks/api-actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectContext } from '../../providers';
import { PrivilegeContainer } from '../../components/generic/PrivilegeContainer';

export const ProjectUsersPage: React.FC = () => {
  const { selectedProject } = useProjectContext();
  const [inviteLink, setInviteLink] = useState<string>();
  const privileges = usePrivileges();
  const { createApiAction } = useApiActions();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [page, setPage] = useState(0);

  const pageSize = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projectUsers', page],
    queryFn: () =>
      createApiAction<{ total: number; users: User[] }>(async ({ client }) => {
        return client
          .get(`projects/${selectedProject?.id}/users`, { searchParams: { page, size: pageSize } })
          .json<{ users: User[]; total: number }>();
      }),
  });

  const { mutate: createProjectInvitation, isLoading: createInvitationLoading } = useMutation({
    mutationFn: ({ projectId }: { projectId: string }) =>
      createApiAction(async ({ client }) => {
        const { projectInvitation } = await client
          .post(`projects/${projectId}/invitations`)
          .json<{ projectInvitation: ProjectInvitation }>();

        return projectInvitation;
      }),
    onSuccess: (data) => {
      if (data) {
        setInviteLink(`${window.location.protocol}//${window.location.host}/account/invitations/${data.id}`);
      }
    },
    onError: () => {
      toast({ status: 'error', title: 'Failed to create project invitation' });
    },
  });

  const { mutate: deleteUser, isLoading: deleteUserLoading } = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      createApiAction(async ({ client }) => client.delete(`projects/${projectId}/users/${userId}`)),
    onSuccess: () => {
      toast({ status: 'success', title: 'The user has been deleted' });
      queryClient.invalidateQueries(['projectUsers']);
    },
    onError: () => {
      toast({ status: 'error', title: 'Failed to delete user' });
    },
  });

  const onInvite = async () => {
    if (!selectedProject) return;

    createProjectInvitation({ projectId: selectedProject.id });
  };

  if (!selectedProject) return null;

  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Project Users
      </Heading>
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
      <PaginatedTable<User>
        columns={[
          {
            id: 'avatar',
            render: ({ row }) => <Avatar name={`${row.firstName} ${row.lastName}`} src={row.picture} size="sm" />,
          },
          { id: 'name', title: 'Name', render: ({ row }) => `${row.firstName} ${row.lastName}` },
          { id: 'email', title: 'Email', render: ({ row }) => row.email },
          { id: 'role', title: 'Role', render: ({ row }) => <Badge>{row.role}</Badge> },
          {
            id: 'setRole',
            render: ({ row }) =>
              privileges.PROJECT_USERS.DELETE && row.role !== 'OWNER' ? (
                <ConfirmationButton
                  onConfirm={() => deleteUser({ projectId: selectedProject.id, userId: row.id })}
                  title="Delete"
                  description="Are you sure you want to delete this user?"
                  isLoading={deleteUserLoading}
                  triggerElement={<IconButton aria-label="Delete project" icon={<MdDelete />} colorScheme="red" />}
                />
              ) : null,
          },
        ]}
        data={data?.users || []}
        totalRecords={data?.total || 0}
        isLoading={isLoading}
        pageSize={10}
        onChangePage={async ({ page }) => {
          setPage(page);
        }}
        onRefresh={async () => {
          refetch();
        }}
        actions={
          <PrivilegeContainer operation={Operation.CREATE} entity={Entity.PROJECT_USERS}>
            <IconButton
              aria-label="Invite user"
              icon={<MdPersonAdd />}
              onClick={onInvite}
              isLoading={createInvitationLoading}
            />
          </PrivilegeContainer>
        }
        emptyMessage="No users to display"
      />
    </>
  );
};

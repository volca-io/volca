import { Select, useToast, FormControl } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { usePrivileges } from '../../hooks/roles';
import { useAuthContext } from '../../providers';
import { Project, User } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiActions } from '../../hooks/api-actions';

type FormValues = {
  role: string;
};

type RolePickerProps = {
  project: Project;
  user: User;
};

export const RolePicker: React.FC<RolePickerProps> = ({ user, project }) => {
  const privileges = usePrivileges();
  const { register, handleSubmit } = useForm<FormValues>();
  const { user: currentUser } = useAuthContext();
  const { createApiAction } = useApiActions();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutate } = useMutation({
    mutationFn: ({ projectId, userId, role }: { projectId: string; userId: string; role: string }) =>
      createApiAction(async ({ client }) => client.put(`projects/${projectId}/users/${userId}`, { json: { role } })),
    onSuccess: (_, { userId }) => {
      toast({ status: 'success', title: 'The users role has been updated' });
      queryClient.invalidateQueries(['projectUsers', userId]);
    },
    onError: () => {
      toast({ status: 'error', title: 'Failed to update role' });
    },
  });

  return (
    <form
      onChange={handleSubmit((data) => mutate({ projectId: project.id, userId: user.id, role: data.role }))}
      noValidate
    >
      <FormControl isRequired>
        <Select
          {...register('role', { required: true })}
          defaultValue={user.role}
          disabled={!privileges.PROJECT_USERS.UPDATE || currentUser?.id === user.id || user.role === 'OWNER'}
        >
          {user.role === 'OWNER' && <option value="OWNER">Owner</option>}
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
        </Select>
      </FormControl>
    </form>
  );
};

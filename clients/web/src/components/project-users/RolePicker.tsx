import { Select, InputGroup } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { useProjectUserActions } from '../../hooks';
import { usePrivileges } from '../../hooks/roles';
import { currentUserState } from '../../state';
import { Project, User } from '../../types';

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
  const currentUser = useRecoilValue(currentUserState);
  const { updateProjectUser } = useProjectUserActions();
  return (
    <form onChange={handleSubmit((data) => updateProjectUser(project.id, user.id, data.role))}>
      <InputGroup size="md">
        <Select
          {...register('role', { required: true })}
          defaultValue={user.role}
          disabled={!privileges.PROJECT_USERS.UPDATE || currentUser?.id === user.id || user.role === 'OWNER'}
        >
          {user.role === 'OWNER' && <option value="OWNER">Owner</option>}
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
        </Select>
      </InputGroup>
    </form>
  );
};

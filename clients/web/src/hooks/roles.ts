import { useRecoilValue } from 'recoil';
import { currentUserState, selectedProjectSelector } from '../state';

type PrivilegeFlags = {
  CREATE: boolean;
  READ: boolean;
  UPDATE: boolean;
  DELETE: boolean;
};

type Privileges = {
  PROJECTS: PrivilegeFlags;
  PROJECT_USERS: PrivilegeFlags;
};

const basicPrivileges: Privileges = {
  PROJECTS: {
    CREATE: true,
    READ: true,
    UPDATE: false,
    DELETE: false,
  },
  PROJECT_USERS: {
    CREATE: false,
    READ: true,
    UPDATE: false,
    DELETE: false,
  },
};

const useCurrentRole = () => {
  const selectedProject = useRecoilValue(selectedProjectSelector);
  const currentUser = useRecoilValue(currentUserState);
  return selectedProject?.users?.find((u) => u.id === currentUser?.id)?.role;
};

export const usePrivileges = () => {
  const currentRole = useCurrentRole();
  const privileges = { ...basicPrivileges };
  if (currentRole === 'ADMIN' || currentRole === 'OWNER') {
    privileges.PROJECTS.UPDATE = true;
    privileges.PROJECTS.DELETE = true;
    privileges.PROJECT_USERS.CREATE = true;
    privileges.PROJECT_USERS.UPDATE = true;
    privileges.PROJECT_USERS.DELETE = true;
  }
  return privileges;
};

import { useRecoilValue } from 'recoil';
import { currentUserState, selectedProjectSelector } from '../state';

export enum Entity {
  PROJECTS = 'PROJECTS',
  PROJECT_USERS = 'PROJECT_USERS',
}

export enum Operation {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

type Privileges = Record<Role, Record<Entity, Record<Operation, boolean>>>;

// Returns an object { <operation>: <boolean> } that defaults to false if the operation is not in the allowedOperations array
const getOperations = (allowedOperations: Operation[]) =>
  Object.keys(Operation).reduce(
    (all, one) => ({
      [one]: allowedOperations.includes(one as Operation),
      ...all,
    }),
    {} as Record<Operation, boolean>
  );

const privileges: Privileges = {
  OWNER: {
    PROJECTS: getOperations([Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE]),
    PROJECT_USERS: getOperations([Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE]),
  },
  ADMIN: {
    PROJECTS: getOperations([Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE]),
    PROJECT_USERS: getOperations([Operation.CREATE, Operation.READ, Operation.UPDATE, Operation.DELETE]),
  },
  MEMBER: {
    PROJECTS: getOperations([Operation.CREATE, Operation.READ]),
    PROJECT_USERS: getOperations([Operation.READ]),
  },
};

const useCurrentRole = () => {
  const selectedProject = useRecoilValue(selectedProjectSelector);
  const currentUser = useRecoilValue(currentUserState);
  return selectedProject?.users?.find((u) => u.id === currentUser?.id)?.role as Role;
};

export const usePrivileges = () => {
  const currentRole = useCurrentRole();
  return privileges[currentRole];
};

import { Entity, Operation, usePrivileges } from '../../hooks/roles';

type PrivilegeContainerProps = {
  children?: React.ReactNode;
  entity: Entity;
  operation: Operation;
};

export const PrivilegeContainer = ({ children, entity, operation }: PrivilegeContainerProps) => {
  const privileges = usePrivileges();
  return privileges[entity][operation] ? <>{children}</> : null;
};

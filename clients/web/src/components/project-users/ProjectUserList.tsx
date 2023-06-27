import React from 'react';
import { Table, TableContainer, Thead, Th, Tr, Td, Tbody, Avatar } from '@chakra-ui/react';

import { User, Project } from '../../types';
import { RolePicker } from './RolePicker';
import { usePrivileges } from '../../hooks/roles';
import { DangerButton } from '../generic/DangerButton';

type ProjectUserListProps = {
  project: Project;
  users: User[];
  deleteUser: (projectId: string, userId: string) => void;
};

const ProjectUserList: React.FC<ProjectUserListProps> = ({ project, users, deleteUser }) => {
  const privileges = usePrivileges();
  return (
    <>
      <TableContainer w="100%" mt={6}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Name</Th>
              <Th>E-mail</Th>
              <Th minW={150}>Role</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td pl={0}>
                  <Avatar name={`${user.firstName} ${user.lastName}`} src={user.picture} size="sm" />
                </Td>
                <Td>{`${user.firstName} ${user.lastName}`}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <RolePicker project={project} user={user} />
                </Td>
                <Td style={{ textAlign: 'end' }}>
                  {privileges.PROJECT_USERS.DELETE && user.role !== 'OWNER' && (
                    <DangerButton
                      minW={100}
                      onClick={() => deleteUser(project.id, user.id)}
                      title={'Delete'}
                      body={'Are you sure you want to delete this user?'}
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProjectUserList;

import React from 'react';
import { Button, Table, TableContainer, Thead, Th, Tr, Td, Tbody } from '@chakra-ui/react';

import { User, Project } from '../../types';

type ProjectUserListProps = {
  project: Project;
  users: User[];
};

const ProjectUserList: React.FC<ProjectUserListProps> = ({ project, users }) => {
  return (
    <>
      <TableContainer style={{ width: '100%' }}>
        <Table marginTop="8" background="white" borderRadius="16px" variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>E-mail</Th>
              <Th>Role</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{`${user.first_name} ${user.last_name}`}</Td>
                <Td>{user.email}</Td>
                <Td>{user.id === project.admin_id ? 'Admin' : 'Member'}</Td>
                <Td style={{ textAlign: 'end' }}>
                  {user.id === project.admin_id ? null : (
                    <Button minWidth={'160px'} colorScheme="red">
                      Delete
                    </Button>
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
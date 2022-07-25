import React from 'react';
import { Button, Table, TableContainer, Thead, Th, Tr, Td, Tbody, Avatar } from '@chakra-ui/react';

import { User, Project } from '../../types';

type ProjectUserListProps = {
  project: Project;
  users: User[];
};

const ProjectUserList: React.FC<ProjectUserListProps> = ({ project, users }) => {
  return (
    <>
      <TableContainer w="100%" mt={6}>
        <Table>
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Name</Th>
              <Th>E-mail</Th>
              <Th>Role</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td pl={0}>
                  <Avatar name={`${user.first_name} ${user.last_name}`} size="sm" />
                </Td>
                <Td>{`${user.first_name} ${user.last_name}`}</Td>
                <Td>{user.email}</Td>
                <Td>{user.id === project.admin_id ? 'Admin' : 'Member'}</Td>
                <Td style={{ textAlign: 'end' }}>
                  {/* TODO: Add action to this button and only show when the current user is admin */}
                  {user.id === project.admin_id ? null : (
                    <Button minWidth="160px" colorScheme="red">
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

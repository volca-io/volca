import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { Button, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Heading } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { UserConsumer } from '../providers/user-provider';
import { Project } from '../types';

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([] as Project[]);
  useEffect(() => {
    const getProjects = async () => {
      const data = await ApiClient.getProjects();
      setProjects(data);
    };
    getProjects();
  }, []);

  return (
    <AuthenticatedLayout>
      <Heading>Select Project</Heading>
      <TableContainer style={{ width: '100%' }}>
        <Table marginTop="8" background="white" borderRadius="16px" variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((project) => (
              <Tr key={project.id}>
                <Td>{project.name}</Td>
                <Td style={{ textAlign: 'end' }}>
                  <UserConsumer>
                    {({ setSelectedProject, selectedProject }) => {
                      const onSelectProject = () => {
                        localStorage.setItem('selectedProjectId', project.id);
                        setSelectedProject(project);
                        navigate(`/projects/${project.id}`);
                      };
                      const onClickSelectedProject = () => navigate(`/projects/${project.id}`);
                      return selectedProject && selectedProject.id === project.id ? (
                        <Button minWidth={'160px'} rightIcon={<CheckIcon />} onClick={onClickSelectedProject}>
                          Selected
                        </Button>
                      ) : (
                        <Button minWidth={'160px'} onClick={onSelectProject} colorScheme="blue">
                          Select
                        </Button>
                      );
                    }}
                  </UserConsumer>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button leftIcon={<AddIcon />} onClick={() => navigate('/projects/create')}>
        Create Project
      </Button>
    </AuthenticatedLayout>
  );
};

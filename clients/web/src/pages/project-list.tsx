import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { Button, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Heading } from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { ProjectContext } from '../providers/project-provider';
import { Project } from '../types';

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([] as Project[]);
  const { selectedProject, setSelectedProject } = useContext(ProjectContext);

  useEffect(() => {
    const getProjects = async () => {
      const data = await ApiClient.getProjects();
      setProjects(data);
      if (data.length === 0) {
        navigate('/projects/create');
      }
    };
    getProjects();
  }, [navigate]);

  const onSelectProject = (project: Project) => {
    setSelectedProject(project);
    navigate(`/projects/${project.id}`);
  };

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
                  {selectedProject && selectedProject.id === project.id ? (
                    <Button minWidth={'160px'} rightIcon={<CheckIcon />}>
                      Selected
                    </Button>
                  ) : (
                    <Button minWidth={'160px'} onClick={() => onSelectProject(project)} colorScheme="blue">
                      Select
                    </Button>
                  )}
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

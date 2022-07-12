import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { Button, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Heading } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { currentProjectSelector, projectsSelector } from '../state/projects';
import { Project } from '../types';

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setProject] = useRecoilState(currentProjectSelector);
  const projects = useRecoilValue(projectsSelector);

  useEffect(() => {
    if (projects.length === 0) {
      navigate('/projects/create');
    }
  }, [navigate, projects]);

  const onSelectProject = (project: Project) => {
    setProject(project);
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
            {projects &&
              projects.map((project) => (
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

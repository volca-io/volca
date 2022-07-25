import { Button, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Spacer } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MdAdd, MdWork } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { currentProject, projects as projectsState, currentUser } from '../state';
import { Project, User } from '../types';
import { ProjectInactiveSubscriptionDialog } from '../components/projects/ProjectInactiveSubscriptionDialog';
import { PageHeading } from '../components/generic/PageHeading';

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [, setProject] = useRecoilState(currentProject);
  const [projects] = useRecoilState(projectsState);
  const user = useRecoilValue(currentUser);

  useEffect(() => {
    if (projects.length === 0) {
      navigate('/projects/create');
    }
  }, [navigate, projects]);

  const onSelectProject = (project: Project) => {
    setProject(project);
    navigate(`/projects/${project.id}/settings`);
  };

  const ManageButton = ({ project, user }: { project: Project; user: User }) => {
    if (!project?.admin.has_active_subscription) {
      return <ProjectInactiveSubscriptionDialog project={project} user={user} />;
    }
    return (
      <Button w={'100%'} onClick={() => onSelectProject(project)} colorScheme="blue">
        Select
      </Button>
    );
  };

  return (
    <AuthenticatedLayout sidebar={false}>
      <PageHeading title="Projects" icon={MdWork} />
      <TableContainer style={{ width: '100%' }}>
        <Table marginTop="8" variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th w="180px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {user &&
              projects &&
              projects.map((project) => (
                <Tr key={project.id}>
                  <Td>{project.name}</Td>
                  <Td style={{ textAlign: 'end' }}>
                    {project && user && <ManageButton project={project} user={user} />}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Spacer />
      <Button leftIcon={<MdAdd />} onClick={() => navigate('/projects/create')}>
        Create Project
      </Button>
    </AuthenticatedLayout>
  );
};

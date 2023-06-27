import { Text, Heading, Icon, Badge, Box, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdGroup, MdWork } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { Project } from '../types';
import { InactiveProjectDialog } from '../components/projects/InactiveProjectDialog';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { useProjectsContext, useAuthContext } from '../providers';

const cardStyle = {
  minHeight: '180px',
  cursor: 'pointer',
};

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [inactiveProjectId, setInactiveProjectId] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { projects, setSelectedProject } = useProjectsContext();

  useEffect(() => {
    if (projects.length === 0) {
      navigate('/projects/create');
    }
  }, [projects, navigate]);

  const onSelectProject = (project: Project) => {
    setSelectedProject(project);
    navigate(`/projects/${project.id}/dashboard`);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <SoftCard
      key={project.id}
      style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      onClick={() =>
        project.owner.hasActiveSubscription ? onSelectProject(project) : setInactiveProjectId(project.id)
      }
    >
      <Box textAlign={['center', 'left']}>
        <Heading size="md">{project.name}</Heading>
        <Badge variant={project.owner.hasActiveSubscription ? 'solid' : 'subtle'}>
          {project.owner.hasActiveSubscription ? 'Active' : 'Inactive'}
        </Badge>
      </Box>
      <Box display="flex" flexDir="row">
        <Icon as={MdGroup} boxSize="24px" />
        <Text ml="2">{project.users?.length}</Text>
      </Box>
      {user && !project.owner.hasActiveSubscription && (
        <InactiveProjectDialog
          isOpen={inactiveProjectId === project.id}
          onClose={() => setInactiveProjectId(null)}
          project={project}
          user={user}
        />
      )}
    </SoftCard>
  );

  return (
    <AuthenticatedLayout sidebar={false}>
      <PageHeading title="Projects" icon={MdWork} />
      <SimpleGrid minChildWidth="200px" width="100%" spacingX="40px" spacingY="20px">
        {user && projects && projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        {user?.hasActiveSubscription && (
          <SoftCard
            onClick={() => navigate('/projects/create')}
            style={{
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon boxSize="48px" as={MdAdd} />
            <Heading as="h3" size="sm" textAlign="center">
              Create Project
            </Heading>
          </SoftCard>
        )}
      </SimpleGrid>
    </AuthenticatedLayout>
  );
};

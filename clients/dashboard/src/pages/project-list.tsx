import { Text, Heading, Icon, Card, CardHeader, CardFooter, Badge, Flex } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdGroup } from 'react-icons/md';

import { Project } from '../types';
import { useProjectContext } from '../providers';

export const ListProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedProject, projects } = useProjectContext();

  const onSelectProject = (project: Project) => {
    setSelectedProject(project);
    navigate(`/projects/${project.id}/dashboard`);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card
      key={project.id}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      _hover={{
        cursor: 'pointer',
      }}
      w="100%"
      maxW={{ md: '300px' }}
      onClick={() => onSelectProject(project)}
    >
      <CardHeader>
        <Heading size="md">{project.name}</Heading>
        <Badge variant={project.owner.hasActiveSubscription ? 'solid' : 'subtle'} bg="brand.400">
          {project.owner.hasActiveSubscription ? 'Active' : 'Inactive'}
        </Badge>
      </CardHeader>
      <CardFooter>
        <Icon as={MdGroup} boxSize="24px" />
        <Text ml="2">{project.users?.length}</Text>
      </CardFooter>
    </Card>
  );

  return (
    <Flex gap={4} flexDirection={{ base: 'column', md: 'row' }}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <Card
        onClick={() => navigate('/projects/create')}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={10}
        w="100%"
        maxW={{ md: '300px' }}
        _hover={{
          cursor: 'pointer',
        }}
      >
        <Icon boxSize="48px" as={MdAdd} />
        <Heading as="h3" size="sm" textAlign="center">
          Create Project
        </Heading>
      </Card>
    </Flex>
  );
};

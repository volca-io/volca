import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, FormLabel, Heading, Input, Button, Text } from '@chakra-ui/react';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  return (
    <AuthenticatedLayout>
      <Heading>Create Project</Heading>
      <Text>
        To get started using SaaS Boilerplate, you need to create a project. Give your project a name and hit "Go!".
      </Text>
      <FormControl isRequired>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input onChange={(event) => setName(event.target.value)} id="name" type="text" />
      </FormControl>
      <Button
        type="submit"
        onClick={async () => {
          try {
            await ApiClient.createProject({ name });
            navigate('/projects');
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Go!
      </Button>
    </AuthenticatedLayout>
  );
};

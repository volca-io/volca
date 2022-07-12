import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { DefaultLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';

export const AcceptProjectInvitation: React.FC = () => {
  const { key } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const acceptInvitation = async () => {
      if (key) {
        try {
          await ApiClient.acceptProjectInvitation({ key });
          setMessage('Invitation accepted. Log in to access your new project.');
        } catch (error) {
          console.error(error);
        }
      }
    };
    acceptInvitation();
  }, [key]);

  return (
    <DefaultLayout>
      <Box>
        <Text>{message}</Text>
      </Box>
    </DefaultLayout>
  );
};

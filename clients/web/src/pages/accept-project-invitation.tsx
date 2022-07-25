import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';

export const AcceptProjectInvitationPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Loading...');
  const { key } = useParams();

  useEffect(() => {
    const acceptInvitation = async () => {
      if (key) {
        try {
          await ApiClient.acceptProjectInvitation({ key });
          setMessage('Invitation accepted. Redirecting...');
          navigate('/projects');
        } catch (error) {
          setMessage('Something went wrong. Make sure your invitation is still valid.');
          console.error(error);
        }
      }
    };
    acceptInvitation();
  }, [key, navigate]);

  return (
    <AuthenticatedLayout sidebar={false}>
      <Box>
        <Text>{message}</Text>
      </Box>
    </AuthenticatedLayout>
  );
};

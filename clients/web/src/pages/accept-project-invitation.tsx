import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthenticatedLayout } from '../layouts';
import { useProjectUserActions } from '../hooks';

export const AcceptProjectInvitationPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Loading...');
  const { key } = useParams();
  const { acceptProjectInvitation } = useProjectUserActions();

  useEffect(() => {
    const acceptInvitation = async () => {
      if (key) {
        await acceptProjectInvitation(key);
        setMessage('Invitation accepted. Redirecting...');
        navigate('/');
      }
    };
    acceptInvitation();
  }, [key, navigate, acceptProjectInvitation]);

  return (
    <AuthenticatedLayout sidebar={false}>
      <Box>
        <Text>{message}</Text>
      </Box>
    </AuthenticatedLayout>
  );
};

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingPage } from './loading';
import { useApiClient } from '../hooks/api-actions';
import { ErrorPage } from './error-page';
import { useToast } from '@chakra-ui/react';

export const AcceptAppInvitationPage: React.FC = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const { mutate: acceptInvite, error } = useMutation({
    mutationFn: ({ id }: { id: string }) => client.get(`invitations/${id}`).json(),
    onError: () => {
      toast({ status: 'error', title: 'Something went wrong, make sure your invitation is still valid' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast({ status: 'success', title: 'Successfully joined project' });
      navigate('/');
    },
  });

  useEffect(() => {
    if (!id) return;

    acceptInvite({ id });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <ErrorPage
        heading="Failed to accept invitation"
        description="Make sure the invitation is not expired"
        reloadEnabled={false}
      />
    );
  }

  return <LoadingPage />;
};

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectActions } from '../hooks';
import { LoadingPage } from './loading';
import { useApiActions } from '../hooks/api-actions';
import { ErrorPage } from './error-page';

export const AcceptProjectInvitationPage: React.FC = () => {
  const { id } = useParams();
  const { executeApiAction } = useApiActions();
  const { listProjects } = useProjectActions();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const acceptInvitation = async () => {
      if (id) {
        await executeApiAction({
          action: ({ client }) => client.get(`project-invitations/${id}`).json(),
          errorMessage: 'Something went wrong, make sure your invitation is still valid',
          successMessage: 'Successfully joined project',
          onSuccess: async () => {
            await listProjects();
            navigate('/');
          },
          onError: (err: unknown) => {
            if (err instanceof Error && err.name === 'PROJECT_INVITATION_EXPIRED') {
              setError(err.message);
            }
            setError('Something went wrong while accepting the invitation');
          },
        });
      }
    };

    acceptInvitation();

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

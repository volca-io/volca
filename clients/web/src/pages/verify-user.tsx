import { Text, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { DefaultLayout } from '../layouts';
import { useUserActions } from '../hooks';
import { AlertBox } from '../components/generic/AlertBox';
import { useEffect, useState } from 'react';
import { loadingState } from '../state';
import { LoadingPage } from './loading';

export const VerifyUserPage: React.FC = () => {
  const search = useLocation().search;
  const { verifyUser } = useUserActions();
  const loading = useRecoilValue(loadingState);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const executeAsync = async (verifyToken: string) => {
      await verifyUser(verifyToken);
    };

    const verifyToken = new URLSearchParams(search).get('verify-token');
    if (verifyToken) {
      executeAsync(verifyToken);
    } else {
      setError('Your verification link is invalid');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (loading) return <LoadingPage />;

  if (error)
    return (
      <DefaultLayout displayLogo>
        <Flex width="100%" alignSelf="center" flexGrow={1} justifyContent="center">
          <Flex
            direction="column"
            justifyContent={{ base: 'flex-start ', md: 'center' }}
            flexGrow={1}
            maxW={600}
            p={{
              base: 0,
              sm: 8,
            }}
          >
            <AlertBox title="Invalid link" status="warning" description={<Text>{error}</Text>} />
          </Flex>
        </Flex>
      </DefaultLayout>
    );

  return null;
};

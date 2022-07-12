import { Heading } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { AuthenticatedLayout } from '../layouts';
import { currentUser } from '../state';

export const Dashboard: React.FC = () => {
  const user = useRecoilValue(currentUser);

  return (
    <AuthenticatedLayout>
      <Heading>{`Welcome, ${user?.first_name}`}</Heading>
    </AuthenticatedLayout>
  );
};

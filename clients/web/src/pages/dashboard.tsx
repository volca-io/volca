import { Text } from '@chakra-ui/react';
import { MdDashboard } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { AuthenticatedLayout } from '../layouts';
import { currentUser } from '../state';

export const DashboardPage: React.FC = () => {
  const user = useRecoilValue(currentUser);

  return (
    <AuthenticatedLayout>
      <SoftCard>
        <PageHeading title="Dashboard" icon={MdDashboard} />
        <Text mt={6}>{`Welcome, ${user?.first_name} 👋`}</Text>
      </SoftCard>
    </AuthenticatedLayout>
  );
};

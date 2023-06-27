import { Text, SimpleGrid, VStack } from '@chakra-ui/react';
import { MdDashboard } from 'react-icons/md';

import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { StatCard, StatProps } from '../components/generic/StatCard';
import { AuthenticatedLayout } from '../layouts';
import { useAuthContext } from '../providers';

const stats: StatProps[] = [
  {
    title: 'Users',
    number: '548',
    percentage: 16,
    type: 'increase',
  },
  {
    title: 'Revenue',
    number: '$1423',
    percentage: 3,
    type: 'increase',
  },
  {
    title: 'Engagement',
    number: '89%',
    percentage: 6,
    type: 'increase',
  },
  {
    title: 'Visitors',
    number: '4387',
    percentage: 20,
    type: 'increase',
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <AuthenticatedLayout>
      <VStack spacing={6} align="flex-start">
        <SoftCard w="100%">
          <PageHeading title="Dashboard" icon={MdDashboard} />
          <Text mt={6}>{`Welcome, ${user?.firstName} 👋`}</Text>
        </SoftCard>
        <SimpleGrid pt={2} minChildWidth="200px" width="100%" spacingX="40px" spacingY="20px">
          {stats.map((stat, index) => (
            <StatCard key={`card-${index}`} {...stat} />
          ))}
        </SimpleGrid>
      </VStack>
    </AuthenticatedLayout>
  );
};

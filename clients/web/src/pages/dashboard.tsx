import { Text, Grid, GridItem } from '@chakra-ui/react';
import { MdDashboard } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { PageHeading } from '../components/generic/PageHeading';
import { SoftCard } from '../components/generic/SoftCard';
import { StatCard, StatProps } from '../components/generic/StatCard';
import { AuthenticatedLayout } from '../layouts';
import { currentUserState } from '../state';

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
  const user = useRecoilValue(currentUserState);

  return (
    <AuthenticatedLayout>
      <SoftCard w="100%">
        <PageHeading title="Dashboard" icon={MdDashboard} />
        <Text mt={6}>{`Welcome, ${user?.first_name} 👋`}</Text>
      </SoftCard>
      <Grid w="100%" pt={2} templateColumns="repeat(4, 1fr)" gap={4}>
        {stats.map((stat) => (
          <GridItem>
            <StatCard {...stat} />
          </GridItem>
        ))}
      </Grid>
    </AuthenticatedLayout>
  );
};

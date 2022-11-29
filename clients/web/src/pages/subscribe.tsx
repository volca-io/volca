import React from 'react';
import {
  Heading,
  Button,
  Text,
  Box,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { MdVpnKey, MdPayments, MdBusinessCenter, MdLock, MdChevronRight } from 'react-icons/md';
import { IoIosRocket } from 'react-icons/io';

import { AuthenticatedLayout } from '../layouts';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state';
import { SoftCard } from '../components/generic/SoftCard';
import { IconType } from 'react-icons';
import { PageHeading } from '../components/generic/PageHeading';
import { useSubscriptionActions } from '../hooks';

export const SubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const user = useRecoilValue(currentUserState);
  const { activateSubscription } = useSubscriptionActions();

  const onActivate = async () => {
    try {
      const session = await activateSubscription();
      if (session) window.location.replace(session.url);
    } catch (error) {
      console.error(error);
    }
  };

  type Feature = { icon: IconType; title: string; description: string };

  const features = [
    {
      icon: MdVpnKey,
      title: 'Authentication',
      description: 'Secure and reliable authentication out of the box',
    },
    {
      icon: MdPayments,
      title: 'Payments',
      description: 'Enable your users to subscribe to your product',
    },
    {
      icon: MdBusinessCenter,
      title: 'Projects',
      description: 'Enable your users to create projects and invite their team',
    },
    {
      icon: MdLock,
      title: 'Secure',
      description: 'Built with best practice security',
    },
  ] as Feature[];

  const FeatureCard = ({ feature }: { feature: Feature }) => {
    const { title, description, icon } = feature;
    return (
      <SoftCard key={title} style={{ minHeight: '140px', display: 'flex', flexDirection: 'column' }}>
        <Box>
          <Heading size="md">
            <Icon as={icon} /> {title}
          </Heading>
        </Box>

        <Text>{description}</Text>
      </SoftCard>
    );
  };

  return (
    <AuthenticatedLayout sidebar={false}>
      <PageHeading title={user?.free_trial_activated ? 'Subscribe' : 'Activate Free Trial'} icon={IoIosRocket} />
      <Box mt={8} />
      {searchParams.get('status') === 'warning' && (
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>Something went wrong while processing your payment. Please try again.</AlertDescription>
        </Alert>
      )}
      <SimpleGrid minChildWidth="200px" width="100%" spacingX="40px" spacingY="20px">
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </SimpleGrid>

      <Box pt={4} pb={4}>
        {!user?.free_trial_activated && (
          <List pb={4}>
            <ListItem>
              <ListIcon as={MdChevronRight} />
              After the free trial is over you will be charged $10 / month.
            </ListItem>
            <ListItem>
              <ListIcon as={MdChevronRight} />
              If you cancel your subscription before the free trial is over, you will not be charged.
            </ListItem>
            <ListItem>
              <ListIcon as={MdChevronRight} />
              You can cancel your subscription at any time.{' '}
            </ListItem>
          </List>
        )}

        <Text>
          {user?.free_trial_activated
            ? 'Subscribe to start using Volca.'
            : 'Activate the 7-day free trial to start using Volca.'}
        </Text>
      </Box>

      <Button
        size="lg"
        rightIcon={<IoIosRocket />}
        colorScheme="blue"
        onClick={onActivate}
        type="submit"
        marginTop="1em"
      >
        {user?.free_trial_activated ? 'Subscribe' : 'Activate!'}
      </Button>
    </AuthenticatedLayout>
  );
};

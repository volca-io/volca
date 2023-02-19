import React from 'react';
import {
  Heading,
  Button,
  Text,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  Icon,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { IoIosRocket } from 'react-icons/io';

import { AuthenticatedLayout } from '../layouts';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state';
import { PageHeading } from '../components/generic/PageHeading';
import { useSubscriptionActions } from '../hooks';
import { SoftCard } from '../components/generic/SoftCard';
import { MdBusinessCenter, MdLock, MdPayment, MdVpnKey } from 'react-icons/md';
import { IconType } from 'react-icons';

type Feature = { icon: IconType; title: string; description: string };

const features = [
  {
    icon: MdVpnKey,
    title: 'Authentication',
    description: 'Secure and reliable authentication out of the box',
  },
  {
    icon: MdPayment,
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
      <VStack align="flex-start">
        <Heading size="md" alignItems="center" justifyContent="center">
          <Icon as={icon} mr={2} /> {title}
        </Heading>

        <Text>{description}</Text>
      </VStack>
    </SoftCard>
  );
};

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

  return (
    <AuthenticatedLayout sidebar={false}>
      <VStack spacing={2}>
        {process.env.REACT_APP_STRIPE_TEST_MODE === '1' && (
          <Alert status="info">
            <AlertIcon />
            <AlertTitle>Test payments enabled</AlertTitle>
            <AlertDescription>
              Test mode for payments is enabled and no charges will be made. The checkout will be prefilled with a test
              card that you can use to test Volca.
            </AlertDescription>
          </Alert>
        )}
        {searchParams.get('status') === 'warning' && (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>Something went wrong while processing your payment. Please try again.</AlertDescription>
          </Alert>
        )}
      </VStack>

      <VStack spacing={8} align="flex-start" mt={8}>
        <PageHeading
          title={
            !user?.free_trial_activated
              ? `Welcome to Volca${user ? `, ${user.first_name}` : ''}!`
              : `Welcome back${user ? `, ${user.first_name}` : ''}!`
          }
          size="xl"
        />
        <Text>
          This is the onboarding page your customers will see after signing up. You can use it to highlight some key
          features of your product to increase conversion.
        </Text>
        <SimpleGrid minChildWidth="200px" width="100%" spacingX="40px" spacingY="20px">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </SimpleGrid>
        <Button
          size="lg"
          leftIcon={<IoIosRocket />}
          colorScheme="blue"
          onClick={onActivate}
          type="submit"
          marginTop="1em"
        >
          {!user?.free_trial_activated ? 'Start free trial' : 'Continue'}
        </Button>
      </VStack>
    </AuthenticatedLayout>
  );
};

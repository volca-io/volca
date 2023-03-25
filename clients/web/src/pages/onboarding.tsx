import React, { useEffect, useState } from 'react';
import {
  Heading,
  Button,
  Text,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  VStack,
  useColorModeValue,
  Card,
  Flex,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';

import { AuthenticatedLayout } from '../layouts';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state';
import { PageHeading } from '../components/generic/PageHeading';
import { useSubscriptionActions } from '../hooks';
import { MdCheckCircle, MdRocketLaunch } from 'react-icons/md';
import { Plan, User } from '../types';

const plans = {
  BASIC: {
    title: 'Basic',
    description: 'A plan that fits your customers basic needs',
    price: 19,
    features: ['Feature A', 'Feature B'],
  },
  PLUS: {
    title: 'Plus',
    description: 'A plan that fits most of your customers needs',
    price: 29,
    features: ['Feature B', 'Feature C'],
  },
  PREMIUM: {
    title: 'Premium',
    description: 'A plan that fits all your customers needs',
    price: 39,
    features: ['Feature C', 'Feature D'],
  },
};
export interface PricingCardData {
  features: string[];
  name: string;
  price: string;
}

export const PricingCard = ({
  plan,
  onActivate,
  user,
}: {
  plan: Plan;
  onActivate: (id: string) => Promise<void>;
  user: User;
}) => {
  const accentColor = useColorModeValue('blue.600', 'blue.200');
  if (!(plan.id in plans)) return null;
  const { features, title, price } = plans[plan.id as keyof typeof plans];

  return (
    <Card rounded={{ sm: 'xl' }} display="flex" p="10" overflow="hidden" mb={8} w="380px">
      <VStack spacing={6}>
        <Heading size="lg">{title}</Heading>
      </VStack>
      <Flex align="flex-end" justify="center" fontWeight="extrabold" my="8">
        <Text fontWeight="inherit" fontSize="4xl" lineHeight={'1.4em'} mr={1}>
          $
        </Text>
        <Heading size="3xl" fontWeight="inherit" lineHeight="0.9em" color={accentColor}>
          {price}
        </Heading>
        <Text fontWeight="inherit" fontSize="2xl" lineHeight={'2.2em'} ml={1}>
          / mo
        </Text>
      </Flex>
      <List spacing="4" mb="8" maxW="28ch" mx="auto">
        {features.map((feature, index) => (
          <ListItem fontWeight="medium" key={index}>
            <ListIcon fontSize="xl" as={MdCheckCircle} marginEnd={2} color={accentColor} />
            {feature}
          </ListItem>
        ))}
      </List>
      <Button
        colorScheme="blue"
        size="lg"
        w="full"
        fontWeight="extrabold"
        py={{ md: '8' }}
        leftIcon={<MdRocketLaunch />}
        onClick={() => onActivate(plan.id)}
      >
        {user.free_trial_activated ? 'Buy' : 'Start trial'}
      </Button>
    </Card>
  );
};

export const SubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const user = useRecoilValue(currentUserState);
  const { activateSubscription, listPlans } = useSubscriptionActions();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const getPlans = async () => {
      const data = await listPlans();
      setPlans(data || []);
    };
    getPlans();
  }, [listPlans]);

  const onActivate = async (id: string) => {
    try {
      const session = await activateSubscription(id);
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
              Test mode for payments is enabled and no real charges will be made. The checkout will be prefilled with a
              test card that you can use for testing purposes.
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

      <VStack spacing={8} w="100%" textAlign="center" mt={8}>
        <PageHeading
          title={
            !user?.free_trial_activated
              ? `Welcome to Volca${user ? `, ${user.first_name}` : ''}!`
              : `Welcome back${user ? `, ${user.first_name}` : ''}!`
          }
          size="xl"
        />
        <Text>This is the onboarding page your customers will see after signing up.</Text>
        <Text fontSize="3xl" color={'gray.500'}>
          Start with a 7-day free trial. Cancel at any time.
        </Text>
        <Flex justifyContent={'center'} columnGap={6} flexDir={{ sm: 'column', lg: 'row' }}>
          {user && plans.map((plan) => <PricingCard key={plan.id} plan={plan} onActivate={onActivate} user={user} />)}
        </Flex>
      </VStack>
    </AuthenticatedLayout>
  );
};

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
  Box,
} from '@chakra-ui/react';

import { AuthenticatedLayout } from '../layouts';
import { useSearchParams } from 'react-router-dom';
import { useSubscriptionActions } from '../hooks';
import { MdCheckCircle, MdRocketLaunch } from 'react-icons/md';
import { Plan, User } from '../types';
import { useAppConfigContext, useAuthContext } from '../providers';

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
  const background = useColorModeValue('white', 'gray.900');
  if (!(plan.id in plans)) return null;
  const { features, title, price } = plans[plan.id as keyof typeof plans];

  return (
    <Card rounded={{ sm: 'xl' }} background={background} display="flex" p="10" overflow="hidden" mb={8} w="380px">
      <VStack spacing={6}>
        <Heading size="lg">{title}</Heading>
      </VStack>
      <Flex align="flex-end" justify="center" fontWeight="extrabold" my="8">
        <Text fontWeight="inherit" fontSize="4xl" lineHeight={'1.4em'} mr={0.8}>
          $
        </Text>
        <Heading size="3xl" fontWeight="inherit" lineHeight="0.9em">
          {price}
        </Heading>
        <Text fontWeight="inherit" fontSize="2xl" lineHeight={'2.2em'} ml={1}>
          / mo
        </Text>
      </Flex>
      <List spacing="4" mb="8" maxW="28ch" mx="auto">
        {features.map((feature, index) => (
          <ListItem fontWeight="medium" key={index}>
            <ListIcon fontSize="xl" as={MdCheckCircle} marginEnd={2} />
            {feature}
          </ListItem>
        ))}
      </List>
      <Button
        size="lg"
        w="full"
        fontWeight="extrabold"
        py={{ md: '8' }}
        leftIcon={<MdRocketLaunch />}
        onClick={() => onActivate(plan.id)}
      >
        {user.freeTrialActivated ? 'Buy' : 'Start trial'}
      </Button>
    </Card>
  );
};

export const SubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const { config } = useAppConfigContext();
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
      await activateSubscription(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {config.stripeTestCardEnabled && (
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
      <AuthenticatedLayout sidebar={false}>
        <VStack spacing={4} w="100%" textAlign="center">
          <Box>
            <Heading>
              {!user?.freeTrialActivated
                ? `Welcome to Volca${user ? `, ${user.firstName}` : ''}!`
                : `Welcome back${user ? `, ${user.firstName}` : ''}!`}
            </Heading>
            <Text>This is the onboarding page your customers will see after signing up.</Text>
          </Box>
          <Text as="b">Start with a 7-day free trial. Cancel at any time.</Text>
          <Flex justifyContent={'center'} columnGap={6} flexDir={{ sm: 'column', lg: 'row' }}>
            {user && plans.map((plan) => <PricingCard key={plan.id} plan={plan} onActivate={onActivate} user={user} />)}
          </Flex>
        </VStack>
      </AuthenticatedLayout>
    </>
  );
};

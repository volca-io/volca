import React from 'react';
import {
  Heading,
  Button,
  Text,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  VStack,
  Card,
  Flex,
  List,
  ListItem,
  ListIcon,
  Spacer,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { MdCheckCircle, MdRocketLaunch } from 'react-icons/md/index.js';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plan, PlanId, StripeSession, User } from '../types';
import { useAppConfigContext, useAuthContext } from '../providers';
import { useApiActions } from '../hooks';
import { LoadingPage } from './loading';

type PlanDescriptionMap = {
  [key in PlanId]: {
    title: string;
    description: string;
    price: number;
    features: Array<string>;
  };
};

const plans: PlanDescriptionMap = {
  BASIC: {
    title: 'Basic',
    description: 'The basic plan',
    price: 9.99,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  PLUS: {
    title: 'Plus',
    description: 'The plus plan',
    price: 29.99,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  PREMIUM: {
    title: 'Premium',
    description: 'The premium plan',
    price: 59.99,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
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
  isLoading,
}: {
  plan: Plan;
  onActivate: (id: string) => void;
  user: User;
  isLoading: boolean;
}) => {
  if (!(plan.id in plans)) return null;
  const { features, title, price } = plans[plan.id as keyof typeof plans];
  const isCurrentPlan = user.planId === plan.id;

  return (
    <Card display="flex" p={6} overflow="hidden" mb={8} w="100%" maxW={{ md: '400px' }}>
      <VStack>
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
      <VStack>
        <List spacing={2} mb="8">
          {features.map((feature, index) => (
            <ListItem fontWeight="medium" key={index}>
              <ListIcon color="green.200" fontSize="xl" as={MdCheckCircle} marginEnd={2} />
              {feature}
            </ListItem>
          ))}
        </List>
      </VStack>

      <Spacer />
      <Button
        size="lg"
        w="full"
        fontWeight="extrabold"
        py={{ md: '8' }}
        leftIcon={isCurrentPlan ? <MdCheckCircle /> : <MdRocketLaunch />}
        onClick={() => onActivate(plan.id)}
        isDisabled={isCurrentPlan}
        isLoading={isLoading}
      >
        {isCurrentPlan ? 'Current' : `Get ${title}`}
      </Button>
    </Card>
  );
};

type CreateStripeSessionResponse = {
  stripeSession: StripeSession;
};

export const SubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const { config } = useAppConfigContext();
  const { createApiAction } = useApiActions();
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () =>
      createApiAction<Plan[]>(async ({ client }) => {
        const { plans } = await client.get('stripe/plans').json<{ plans: Plan[] }>();
        return plans;
      }),
  });

  const { mutate, isLoading: isCreateSessionLoading } = useMutation({
    mutationFn: ({ planId }: { planId: string }) =>
      createApiAction(({ client }) =>
        client.post('stripe/sessions', { json: { planId } }).json<CreateStripeSessionResponse>()
      ),
    onError: () => {
      toast({
        status: 'error',
        title:
          'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
      });
    },
    onSuccess: (result) => {
      if (result) {
        window.location.replace(result.stripeSession.url);
      }
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <Heading>No data</Heading>;
  }

  return (
    <>
      <Container maxW="6xl">
        <Flex flexDirection="column" gap={8} alignItems="center">
          <Flex flexDirection="column" textAlign="center">
            <Heading>{`Welcome to Volca${user ? `, ${user.firstName}` : ''}!`}</Heading>
            <Text>This is the onboarding page your customers will see after signing up.</Text>
          </Flex>
          <Flex flexDirection="column" gap={4}>
            {searchParams.get('status') === 'warning' && (
              <Alert status="warning">
                <AlertIcon />
                <AlertTitle>Payment failed</AlertTitle>
                <AlertDescription>
                  Something went wrong while processing your payment. Please try again.
                </AlertDescription>
              </Alert>
            )}
            {config.stripeTestCardEnabled && (
              <Alert status="info">
                <AlertIcon />
                <AlertTitle>Test payments enabled</AlertTitle>

                <AlertDescription>
                  No real charges will be made and the checkout will be prefilled with a test card.
                </AlertDescription>
              </Alert>
            )}
          </Flex>
          <Flex
            w="100%"
            justifyContent="center"
            alignItems="center"
            columnGap={6}
            flexDir={{ base: 'column', lg: 'row' }}
          >
            {user &&
              data.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  onActivate={() => {
                    mutate({ planId: plan.id });
                  }}
                  user={user}
                  isLoading={isCreateSessionLoading}
                />
              ))}
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

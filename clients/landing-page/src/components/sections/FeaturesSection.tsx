import { Box, Button, Flex, Heading, Link, SimpleGrid, Text } from '@chakra-ui/react';
import { MdArrowForward } from 'react-icons/md/index.js';
import { SectionHeader } from '../SectionHeader.js';
import { IconBox } from '../IconBox.js';
import { Icon, Icons } from '../../types/Icon';

export type Feature = {
  title: string;
  details: string;
  icon: Icon;
  href: string;
};
const defaultFeatures: Array<Feature> = [
  {
    title: 'Authentication',
    details: 'Secure and reliable authentication out of the box with AWS Cognito.',
    icon: Icon.MdLock,
    href: '/features/authentication/',
  },
  {
    title: 'Social Sign In',
    details: 'Increase conversion rate with social sign in through Apple, Google and Facebook.',
    icon: Icon.MdLogin,
    href: '/features/social-sign-in/',
  },
  {
    title: 'Subscriptions',
    details: 'Get paid by your users with Volcas built in subscription management powered by Stripe.',
    icon: Icon.MdPayment,
    href: '/features/subscriptions/',
  },
  {
    title: 'CI/CD',
    details: 'Deploy with confidence from day one. Volca comes with a complete CI/CD workflow using GitHub Actions.',
    icon: Icon.FaShip,
    href: '/features/cicd/',
  },
  {
    title: 'Logging',
    details: 'Find and remedy production issues quickly.',
    icon: Icon.MdSearch,
    href: '/features/logging/',
  },
  {
    title: 'Serverless',
    details: 'Pay as you scale and stop spending time on managing servers. Volca runs on AWS Lambda out of the box.',
    icon: Icon.MdCloud,
    href: '/features/serverless/',
  },
  {
    title: 'Infrastructure as Code',
    details: 'Our infrastructure as code setup with AWS CDK allows you to deploy your SaaS with a single command.',
    icon: Icon.FaWrench,
    href: '/features/iac/',
  },
  {
    title: 'Multi Tenancy',
    details: 'Allow your users to create a project and invite their team.',
    icon: Icon.FaBriefcase,
    href: '/features/multitenant/',
  },
  {
    title: 'TypeScript',
    details: 'TypeScript is used in the API, the dashboard and the landing page.',
    icon: Icon.FaCode,
    href: '/features/multitenant/',
  },
];

export const FeaturesSection = ({ features = defaultFeatures }: { features?: Feature[] }) => (
  <Flex flexDirection="column" gap={12}>
    <SectionHeader
      type="h2"
      category="Features"
      title="What can you expect?"
      description="Prebuilt functionality that you would otherwise need spend months developing before you launch your SaaS, drastically cutting down the time to market."
    />

    <SimpleGrid gap={8} minChildWidth={300}>
      {features.map((feature) => (
        <Flex key={feature.title} gap={4}>
          <Flex>
            <IconBox icon={Icons[feature.icon]} />
          </Flex>
          <Flex flexDirection="column" gap={2}>
            <Heading size="md">{feature.title}</Heading>
            <Flex flexGrow={1}>
              <Text>{feature.details}</Text>
            </Flex>
            <Box>
              <Button variant="ghost" size="sm" as={Link} rightIcon={<MdArrowForward />} href={feature.href}>
                Read more
              </Button>
            </Box>
          </Flex>
        </Flex>
      ))}
    </SimpleGrid>
  </Flex>
);

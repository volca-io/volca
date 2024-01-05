import { Box, Button, Card, CardBody, Flex, Icon, Link, Text } from '@chakra-ui/react';
import { MdCheck, MdCloudDownload, MdMail } from 'react-icons/md/index.js';
import { SectionHeader } from '../SectionHeader';

const pricingOptions = [
  {
    title: 'Solo',
    price: '$199',
    usps: [
      'Landing Page',
      'Dashboard',
      'API',
      'Access to the Volca monorepo on GitHub',
      <>
        License for <Link href="/terms/">one project</Link>
      </>,
    ],
    link: 'https://buy.stripe.com/7sI17g0r81408p25ko',
    cta: 'Buy',
    icon: <MdCloudDownload />,
  },
  {
    title: 'Team',
    price: '$399',
    usps: ['Everything in Solo', 'Multiple GitHub collaborators'],
    link: 'https://buy.stripe.com/7sI8zI3Dk6ok48M7sv',
    cta: 'Buy',
    icon: <MdCloudDownload />,
  },
  {
    title: 'Launch',
    price: 'Custom',
    description:
      'We help you get your product to production faster than ever using the power of the Volca SaaS boilerplate in combination with +15 years of experience building everything from mission critical enterprise systems to apps for fast growing startups.',
    link: 'mailto:admin@volca.io',
    cta: 'Contact us',
    icon: <MdMail />,
  },
];

export const PricingSection = () => (
  <Flex flexDirection="column" gap={12} alignItems="center">
    <SectionHeader
      type="h2"
      category="Pricing"
      title="Buy Volca"
      description="After purchasing Volca you will be invited to our GitHub repository where you will find the source code"
    />

    <Flex
      gap={8}
      flexDirection={{ base: 'column', md: 'row' }}
      width="full"
      justifyContent={{ base: 'stretch', md: 'center' }}
      alignItems={{ base: 'center', md: 'stretch' }}
    >
      {pricingOptions.map((price) => (
        <Card key={price.title} flexBasis={0} flexGrow={1} maxW={350} width="100%">
          <CardBody>
            <Flex flexDirection="column" gap={12} textAlign="center" height="100%" fontSize="large">
              <Box>
                <Text as="b">{price.title}</Text>
                <Text fontSize="6xl">{price.price}</Text>
              </Box>
              <Flex flexGrow={1}>
                {price.description && <Text>{price.description}</Text>}
                {price.usps && (
                  <Flex textAlign="start" flexGrow={1} gap={2} flexDirection="column">
                    {price.usps.map((usp, index) => (
                      <Flex alignItems="center" gap={6} key={index}>
                        <Icon as={MdCheck} color="brand.200" /> <Text>{usp}</Text>
                      </Flex>
                    ))}
                  </Flex>
                )}
              </Flex>

              <Link href={price.link} w="full">
                <Button w="full" leftIcon={price.icon}>
                  {price.cta}
                </Button>
              </Link>
            </Flex>
          </CardBody>
        </Card>
      ))}
    </Flex>
  </Flex>
);

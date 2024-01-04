import { Avatar, AvatarGroup, Button, Flex, Heading, Text, Image, Link, Tooltip } from '@chakra-ui/react';
import { MdCloudDownload, MdRocket } from 'react-icons/md/index.js';
import reactLogo from '../assets/react.svg';
import awsLogo from '../assets/aws.svg';
import postgresLogo from '../assets/postgres.svg';
import typescriptLogo from '../assets/typescript.svg';
import stripeLogo from '../assets/stripe.svg';
import yarnLogo from '../assets/yarn.svg';
import oskarAvatar from '../assets/oskar_avatar.webp';
import karlAvatar from '../assets/karl_avatar.webp';
import demo from '../assets/volca-demo.webp';
import { FeaturesSection } from '../components/sections/FeaturesSection.js';
import { PricingSection } from '../components/sections/PricingSection.js';
import { FaqSection } from '../components/sections/FaqSection.js';
import { TestimonialsSection } from '../components/sections/TestimonialsSection.js';
import { DescriptionSection } from '../components/sections/DescriptionSection.js';

const Page = () => {
  return (
    <Flex flexDirection="column" gap={32}>
      <Flex gap={8} h="calc(100svh - 6rem)" as="header">
        <Flex flexDirection="column" gap={8} flex={1} justifyContent="center">
          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            bgGradient="linear(to-l, gradient.start, gradient.end)"
            bgClip="text"
          >
            SaaS Boilerplate and Starter Kit with Node.js and React
          </Heading>
          <Text fontSize="lg">
            Create your SaaS using a starter kit built on proven Node and React patterns that accelerate your
            development and deployment speed.
          </Text>
          <Flex gap={4}>
            <Link href="https://app.volca.io">
              <Button leftIcon={<MdRocket />}>Explore demo</Button>
            </Link>
            <Link href="/pricing/">
              <Button variant="ghost" leftIcon={<MdCloudDownload />}>
                Buy a license
              </Button>
            </Link>
          </Flex>
          <Flex alignItems="center" gap={4}>
            <AvatarGroup>
              <Avatar name="Oskar Karlsson" size="md" src={oskarAvatar} />
              <Avatar name="Karl Eriksson" size="md" src={karlAvatar} />
            </AvatarGroup>
            <Text fontSize="lg">
              Created by{' '}
              <Link href="https://www.linkedin.com/in/oskar-karlsson/" fontWeight="semibold">
                Oskar
              </Link>
              {' & '}{' '}
              <Link href="https://www.linkedin.com/in/erikssonkarl/" fontWeight="semibold">
                Karl
              </Link>
            </Text>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          flex={1}
          display={{ base: 'none', md: 'flex' }}
        >
          <Image
            _hover={{
              transform: 'perspective(1400px) rotateY(-15deg) scale(1.1)',
            }}
            src={demo}
            transition="all 0.3s"
            alt="Volca dashboard demo"
            transform="perspective(1400px) rotateY(-15deg)"
            boxShadow="brand"
            width="100%"
          />
        </Flex>
      </Flex>

      <Flex py={8} gap={4} justifyContent="space-between" display={{ base: 'none', md: 'flex' }}>
        <Tooltip label="React">
          <Image alt="React logotype" src={reactLogo} maxH={20} minH={10} minW={10} width="100%" objectFit="contain" />
        </Tooltip>
        <Tooltip label="AWS">
          <Image alt="AWS logotype" src={awsLogo} maxH={20} minH={10} minW={10} width="100%" objectFit="contain" />
        </Tooltip>
        <Tooltip label="Postgres">
          <Image
            alt="Postgres logotype"
            src={postgresLogo}
            maxH={20}
            minH={10}
            minW={10}
            width="100%"
            objectFit="contain"
          />
        </Tooltip>
        <Tooltip label="TypeScript">
          <Image
            alt="Typescript logotype"
            src={typescriptLogo}
            maxH={20}
            minH={10}
            minW={10}
            width="100%"
            objectFit="contain"
          />
        </Tooltip>
        <Tooltip label="Stripe">
          <Image
            alt="Stripe logotype"
            src={stripeLogo}
            maxH={20}
            minH={10}
            minW={10}
            width="100%"
            objectFit="contain"
          />
        </Tooltip>
        <Tooltip label="yarn">
          <Image alt="Yarn logotype" src={yarnLogo} maxH={20} minH={10} minW={10} width="100%" objectFit="contain" />
        </Tooltip>
      </Flex>

      <DescriptionSection />

      <FeaturesSection />

      <TestimonialsSection />

      <PricingSection />

      <FaqSection />
    </Flex>
  );
};

export default Page;

import { Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { SectionHeader } from '../SectionHeader';
import { MdDashboard } from 'react-icons/md/index.js';
import { IoMdBrowsers } from 'react-icons/io/index.js';
import { AiOutlineApi } from 'react-icons/ai/index.js';
import { IconBox } from '../IconBox';

export const DescriptionSection = () => (
  <Flex flexDirection="column" gap={12} alignItems="center">
    <SectionHeader
      type="h2"
      category="Overview"
      title="What is Volca?"
      description="Volca is a SaaS boilerplate and starter kit that to get your project up and running in
      days instead of months. When you buy Volca, you will get access to
      our monorepo including a static landing page, a React dashboard and a Node.js REST API."
    />

    <SimpleGrid gap={8} minChildWidth={300}>
      <Flex flexDirection="column" gap={4} minHeight={40}>
        <Flex gap={4}>
          <IconBox icon={IoMdBrowsers} size={10} />
          <Heading as="h2" size="lg">
            Landing page
          </Heading>
        </Flex>
        <Text>
          An important aspect of promoting your application and converting users is the design of your landing page.{' '}
        </Text>
        <Text>
          That is why Volca includes a high performance static landing page. The website is designed to load quickly and
          is pre-rendered as static HTML files. The landing page can be easily customized to suit your needs.
        </Text>
        <Text>
          A static site allows search engines to more easily crawl your site and can improve your search engine
          rankings.
        </Text>
        <Text>Built with: React, TypeScript</Text>
      </Flex>
      <Flex flexDirection="column" gap={4} minHeight={40}>
        <Flex gap={4}>
          <IconBox icon={MdDashboard} size={10} />
          <Heading as="h2" size="lg">
            Dashboard
          </Heading>
        </Flex>
        <Text>
          The bread and butter of your SaaS product is the dashboard, this is where your customers will interact with
          your product.
        </Text>
        <Text>
          Volca comes with a React dashboard where users can register, subscribe to your product and invite
          collaborators. You will get all the pages you need for a SaaS product such as authentication, payments,
          project management and more. Get straight to building the features that makes your product unique.
        </Text>
        <Text>Built with: React, TypeScript</Text>
      </Flex>
      <Flex flexDirection="column" gap={4} minHeight={40}>
        <Flex gap={4}>
          <IconBox icon={AiOutlineApi} size={10} />
          <Heading as="h2" size="lg">
            API
          </Heading>
        </Flex>
        <Text>
          We use a decoupled architecture where you can easily swap out, change or use specific parts of the
          boilerplate.
        </Text>
        <Text>
          To achieve this, Volca comes with a REST API that the dashboard communicates with from the start, but you can
          plug in any frontend app you want.
        </Text>
        <Text>The API runs on a serverless architecture that is cost effective, secure and performant.</Text>
        <Text>Built with: Node.js, TypeScript, AWS, Postgres</Text>
      </Flex>
    </SimpleGrid>
  </Flex>
);

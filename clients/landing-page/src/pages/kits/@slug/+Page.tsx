import { Card, CardBody, Container, Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import { FaqSection } from '../../../components/sections/FaqSection';
import { SectionHeader } from '../../../components/SectionHeader';
import { useData } from '../../../renderer/useData';
import { kits } from './data';

export type KitPage = {
  title: string;
  subtitle: string;
  list: {
    title: string;
    url: string;
    image: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
};

const Page = () => {
  const { slug } = useData<{ slug: string }>();
  const page = kits.find((kit) => kit.slug === slug);

  if (!page) {
    throw new Error('Failed to find page with slug ' + slug);
  }

  return (
    <Container maxW="4xl">
      <Flex flexDirection="column" gap={12}>
        <Flex flexDirection="column" gap={4}>
          <SectionHeader category="Kit" title={page.title} description="" />
          <Flex flexDirection="column" gap={4}>
            {page.subtitle}
          </Flex>
        </Flex>
        <Card>
          <CardBody>
            Have you still not decided which tech stack to use to build your SaaS? TypeScript, Node.js and React are a
            powerful combination that lets you use the same language on both frontend and backend.{' '}
            <Link href="/">Read more about our Node.js + TypeScript + React SaaS boilerplate.</Link>
          </CardBody>
        </Card>
        {page.list.map((kit) => (
          <Flex direction="column" gap={6} key={kit.title}>
            <Heading as="h2">{kit.title}</Heading>
            <Image maxWidth={400} src={kit.image} />
            <Text>{kit.description}</Text>
            <Link rel="nofollow noreferrer">Read more about {kit.title}</Link>
          </Flex>
        ))}
        <FaqSection faqs={page.faq} />
      </Flex>
    </Container>
  );
};

export default Page;

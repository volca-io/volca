import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { SectionHeader } from '../SectionHeader';

export type Faq = {
  question: string;
  answer: React.ReactNode;
};

const mainFaqs: Array<Faq> = [
  {
    question: 'What is Volca?',
    answer: (
      <Text>
        Volca is a code template for SaaS products that give you everything you need to start building the features that
        make your product unique. Volca is powered by a NodeJS API and a React frontend built by developers with over 10
        years of experience building and running applications with this technology stack.
      </Text>
    ),
  },
  {
    question: 'Who is Volca for?',
    answer: (
      <Text>
        In short, Volca is built for developers who want to create software products fast. The template can be used by
        beginner and experienced developers alike and is built using the industry best practices with developer
        experience as a top priority.
      </Text>
    ),
  },
  {
    question: 'How is Volca hosted?',
    answer: (
      <Text>
        Volca is hosted on AWS using a cloud native approach. We believe in utilizing the full potential of one cloud
        provider and AWS is our provider of choice. You are however free to modify the template to run on any cloud
        provider that works for you.
      </Text>
    ),
  },
  {
    question: 'How is Volca deployed?',
    answer: (
      <Text>
        All of the infrastructure required to run Volca is defined using AWS CDK and deploys to an AWS account of your
        choosing. By default, GitHub Actions are configured to deploy to your environments when pushing code into your
        GitHub repository.
      </Text>
    ),
  },
  {
    question: 'How much does it cost to host a project using Volca?',
    answer: (
      <Text>
        With the default configuration, the AWS cost is around $12 per month for each environment (production, staging
        etc.) but it can increase if you have a large number of users.
      </Text>
    ),
  },
  {
    question: 'Who built Volca?',
    answer: (
      <Text>
        Volca was built by Oskar and Karl, two full stack developers with a combined programming experience of 20 years.
        They have worked on everything from fast growing apps to huge enterprise systems and all of their learnings have
        been poured into the development of Volca.
      </Text>
    ),
  },
  {
    question: 'Why did you build Volca?',
    answer: (
      <Text>
        After building software products for the last 10 years, we noticed that there is a huge startup time when
        building something from scratch. So we took all the components that we kept rebuilding for each project and put
        them into a single template that anyone can use to kick start their development.
      </Text>
    ),
  },
  {
    question: 'What is a SaaS Boilerplate or Starter Kit?',
    answer: (
      <Text>
        A SaaS (software as a service) boilerplate or starter kit is a pre-built framework that provides a basic
        structure for developing a software as a service (SaaS) application. It typically includes common components and
        functionalities that are needed for building a SaaS application, such as user management, authentication,
        payment processing, and deployment tools. This allows developers to quickly and easily create a SaaS application
        without having to start from scratch. By using a SaaS boilerplate, developers can save time and resources, and
        focus on building the unique features and functionality of their SaaS application.
      </Text>
    ),
  },
  {
    question: 'What are the benefits of using a SaaS boilerplate or starter kit?',
    answer: (
      <Flex direction="column" gap={4}>
        <Text>
          Reduced development time and cost: Using a pre-built SaaS boilerplate can save a significant amount of time
          and resources that would otherwise be spent on developing a custom solution from scratch.
        </Text>

        <Text>
          Streamlined codebase: A SaaS boilerplate typically comes with a well-structured and organized codebase that
          follows best practices and coding standards, making it easier to understand and maintain.
        </Text>

        <Text>
          Built-in security features: A SaaS starter kit often includes built-in security features such as password
          encryption, user authentication, and data protection, which can help protect sensitive customer data and
          prevent security breaches.
        </Text>

        <Text>
          Scalability: A SaaS boilerplate is designed to be scalable, allowing businesses to easily add new features and
          functionality as their needs evolve without having to start from scratch.
        </Text>

        <Text>
          Community support: Many SaaS boilerplates and starter kits are open-source and have active communities of
          developers who contribute to the project and provide support and guidance to users. This can be especially
          helpful for businesses that are new to building SaaS applications.
        </Text>
      </Flex>
    ),
  },
];

export const FaqSection = ({ faqs = mainFaqs }: { faqs?: Faq[] }) => (
  <SimpleGrid minChildWidth={300}>
    <SectionHeader
      type="h2"
      category="FAQ"
      title="FAQs"
      align="start"
      description={
        <>
          Frequently asked questions about Volca. {"Can't"} find what you are looking for? Feel free to{' '}
          <Link href="/contact/">contact us</Link>.
        </>
      }
    />
    <Flex flexGrow={1}>
      <Accordion defaultIndex={[0]} allowMultiple w="100%" gap={4}>
        {faqs.map((faq, index) => (
          <AccordionItem border="none" my={4} key={index}>
            <Heading>
              <AccordionButton>
                <Text fontSize="2xl" textAlign="start" w="100%">
                  {faq.question}
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </Heading>

            <AccordionPanel>{faq.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  </SimpleGrid>
);

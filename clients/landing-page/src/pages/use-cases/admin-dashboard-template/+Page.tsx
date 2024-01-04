import { Container, Flex, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { SectionHeader } from '../../../components/SectionHeader';
import { FeaturesSection } from '../../../components/sections/FeaturesSection';
import { FaqSection } from '../../../components/sections/FaqSection';

const Page = () => (
  <Container maxW="4xl" py={12}>
    <SectionHeader
      title="Admin Dashboard"
      category="Use Case"
      description="Admin Dashboard Template - React, Chakra UI and TypeScript"
    />

    <Flex flexDirection="column" gap={16}>
      <Flex flexDirection="column" gap={4}>
        <Text>
          Volca is an Admin Dashboard UI Template with pages and components for authentication, payments, control panel
          and project management. Shorten the time that it takes to develop a beautiful Admin Dashboard using React and
          Chakra UI. Volca was designed by developers who love beautiful and clean web apps and who have worked for some
          of the top technology startups in Europe.
        </Text>
        <Text>
          The Volca Admin Dashboard comes with a complete backend API and infrastructure as code. This means you do not
          have to worry about setting up an API for your admin dashboard. Instead, you can focus on what matters in your
          business.
        </Text>
      </Flex>
      <Flex flexDirection="column" gap={4}>
        <Heading as="h2">Tech Stack</Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>What</Th>
                <Th>Usage</Th>
                <Th>Why</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td>React</Td>
                <Td>Framework</Td>
                <Td>React is the most popular library for frontend framework and has a strong developer community.</Td>
              </Tr>
              <Tr>
                <Td>Chakra</Td>
                <Td>UI Library </Td>
                <Td>Simple, modular and customizable UI components.</Td>
              </Tr>
              <Tr>
                <Td>Typescript</Td>
                <Td>Language </Td>
                <Td>
                  TypeScript enables you to write type safe frontend and backend applications while still using the vast
                  resources libraries that come with the JavaScript ecosystem.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <FeaturesSection />

      <FaqSection
        faqs={[
          {
            question: 'What is an admin dashboard UI template?',
            answer:
              'An admin dashboard UI template is a premade code template that you can use to kick start your projects.',
          },
          {
            question: 'What are the benefits of using an admin dashboard UI template?',
            answer: (
              <Flex direction={'column'} gap={12}>
                <Text>
                  <b>Improved organization:</b> An admin dashboard template can help users to organize their data and
                  information in a more efficient and user-friendly manner. This can make it easier for users to access
                  and manage their data, leading to better decision making and overall productivity.
                </Text>

                <Text>
                  <b>Increased functionality:</b> Admin dashboard templates often come with built-in features and
                  functionalities that can help users to better manage their data and information. This can include
                  things like data visualization tools, reporting and analysis tools, and other useful features.
                </Text>

                <Text>
                  <b>Enhanced security:</b> Admin dashboard templates often include built-in security features that can
                  help to protect users’ data and information from unauthorized access or breaches. This can include
                  things like password protection, data encryption, and other security measures.
                </Text>

                <Text>
                  <b>Improved collaboration:</b> Many admin dashboard templates are designed to be used by multiple
                  users, allowing for improved collaboration and communication among team members. This can help to
                  improve the overall efficiency and productivity of a team or organization.
                </Text>

                <Text>
                  <b>Time and cost savings:</b> Using an admin dashboard template can help users to save time and reduce
                  costs by providing a pre-designed, ready-to-use solution for managing data and information. This can
                  save users the time and expense of building a custom dashboard from scratch.
                </Text>
              </Flex>
            ),
          },
          {
            question: 'How do I use the Volca admin template?',
            answer:
              'Getting started is easy. After you download the code, you fire up your favorite editor and get coding. You will find documentation on how to get started here on our website.',
          },
          {
            question: 'Can I use my own backend?',
            answer: 'Yes, you can use any backend API or service to back your admin dashboard.',
          },
          {
            question: 'What if I regret my purchase?',
            answer:
              "As long as you haven't created anything with Volca yet, you are always free to request a refund within 14 days of your purchase.",
          },
          {
            question: 'Do you provide support?',
            answer:
              'Yes, you will be invited to a private Slack channel where the Volca team will help you with any challenges you face with the template.',
          },
          {
            question: 'What is an admin dashboard template?',
            answer:
              'An admin dashboard is a user interface (UI) that is designed for use by administrators or other privileged users to manage and monitor the performance of a system or application. An admin dashboard typically includes a range of tools and features that allow administrators to view and analyze key metrics, manage users and permissions, configure settings, and perform other administrative tasks. An admin dashboard may be accessed through a web-based interface, a desktop application, or a mobile app, depending on the specific system or application. It is typically designed to be user-friendly and intuitive, to make it easy for administrators to quickly access and use the tools and features they need.',
          },
        ]}
      />
    </Flex>
  </Container>
);

export default Page;

import { Flex, Text } from '@chakra-ui/react';
import { SectionHeader } from '../SectionHeader';
import { StarIcon } from '@chakra-ui/icons';

const testimonials = [
  {
    text: 'Using Volca has saved us enormous amounts of time to get our project up and running. We get the boring stuff out of the way so that we can focus our resources on what defines the products that we are building.',
    name: 'Mies',
    title: 'CEO',
  },
  {
    text: 'I love the decoupled methodology and the serverless stack that Volca is running on',
    name: 'Allan',
    title: 'Principal Security Architect',
  },
];

export const TestimonialsSection = () => (
  <Flex flexDirection="column" gap={12} alignItems="center">
    <SectionHeader
      type="h2"
      category="Testimonials"
      title="What do our customers think?"
      description="Hear from customers who have built their SaaS using Volca"
    />

    <Flex gap={8} width="full" justifyContent="center" flexDirection={{ base: 'column', md: 'row' }}>
      {testimonials.map(({ text, name, title }) => (
        <Flex flexDirection="column" gap={4} key={title} flexGrow={1} flexBasis={0}>
          <Flex gap={1} fontSize="xl">
            <StarIcon color="brand.400" />
            <StarIcon color="brand.400" />
            <StarIcon color="brand.400" />
            <StarIcon color="brand.400" />
            <StarIcon color="brand.400" />
          </Flex>
          <Flex flexGrow={1}>
            <Text fontSize="xl">"{text}"</Text>
          </Flex>
          <Flex flexDirection="column">
            <Text fontWeight="bold" fontSize="large">
              {name}
            </Text>
            <Text fontSize="large">{title}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  </Flex>
);

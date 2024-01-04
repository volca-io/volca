import { Checkbox, Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export const ToDoList = () => {
  const todos = [
    {
      title: 'Authentication',
      description: 'Set up secure authentication with social sign in',
      completed: true,
    },
    {
      title: 'Subscriptions',
      description: 'Implement subscriptions with Stripe to monetize your SaaS',
      completed: true,
    },
    {
      title: 'Infrastructure',
      description: 'Configure your infrastructure and deploy your SaaS',
      completed: true,
    },
    {
      title: 'CI/CD',
      description: 'Set up a deployment pipeline to automatically test and deploy changes',
      completed: true,
    },
    {
      title: 'Landing page',
      description: 'Create a lightning fast landing page and deploy it',
      completed: true,
    },
    {
      title: 'Build features',
      description: 'Build the features that make your product unique',
      completed: false,
    },
  ];

  return (
    <Flex flexDirection="column" gap={2}>
      {todos.map((todo, index) => (
        <React.Fragment key={todo.title}>
          {index > 0 && <Divider />}
          <Flex alignItems="center" gap={4}>
            <Checkbox isChecked={todo.completed} />
            <Flex flexDirection="column" gap={2}>
              <Text fontSize="md" fontWeight="bold">
                {todo.title}
              </Text>
              <Text fontSize="sm">{todo.description}</Text>
            </Flex>
          </Flex>
        </React.Fragment>
      ))}
    </Flex>
  );
};

import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { Chart } from '../../components/Chart';
import { ToDoList } from '../../components/ToDoList';

export const DashboardPage: React.FC = () => {
  return (
    <>
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={8}>
        <GridItem colSpan={1}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Collected Fees</StatLabel>
                <StatNumber>$0.00</StatNumber>
                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem colSpan={1}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Sent</StatLabel>
                <StatNumber>345,670</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem colSpan={1}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Clicked</StatLabel>
                <StatNumber>45</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  9.05%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem colSpan={1}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Conversions</StatLabel>
                <StatNumber>5,892</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  872
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem colSpan={2}>
          <Card direction="row" overflow="hidden" minHeight="220px">
            <Flex width="100%" backgroundImage="/volcano.jpg" backgroundSize="cover" backgroundPosition="center">
              <Flex flexGrow={1} bgGradient="linear-gradient(270deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)">
                <CardBody color="white">
                  <Flex gap={4} flexDirection="column">
                    <Heading as="h2" fontSize="xl">
                      Accelerate your launch
                    </Heading>
                    <Text fontSize="medium">
                      With the Volca boilerplate, you save the months of work required to set up infrastructure,
                      authentication and payments. Ship faster with Volca.
                    </Text>
                  </Flex>
                </CardBody>
              </Flex>
            </Flex>
          </Card>
        </GridItem>

        <GridItem colSpan={2} rowSpan={2}>
          <Card>
            <CardHeader>
              <Heading as="h2" fontSize="large">
                Tasks
              </Heading>
            </CardHeader>
            <CardBody>
              <ToDoList />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={2} rowSpan={1}>
          <Card>
            <CardBody>
              <Chart
                title="Sales overview"
                series={[
                  {
                    name: 'Web',
                    data: [
                      {
                        x: 'Jan',
                        y: 54,
                      },
                      {
                        x: 'Feb',
                        y: 66,
                      },
                      {
                        x: 'Mar',
                        y: 87,
                      },
                      {
                        x: 'Apr',
                        y: 122,
                      },
                      {
                        x: 'May',
                        y: 118,
                      },
                      {
                        x: 'Jun',
                        y: 136,
                      },
                      {
                        x: 'Jul',
                        y: 90,
                      },
                      {
                        x: 'Aug',
                        y: 157,
                      },

                      {
                        x: 'Sep',
                        y: 189,
                      },
                    ],
                  },
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};

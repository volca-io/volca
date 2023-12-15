import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Card, CardBody } from '@chakra-ui/react';

export type StatProps = {
  title: string;
  number: string;
  percentage: number;
  type: 'increase' | 'decrease';
};

export const StatCard = ({ title, number, percentage, type }: StatProps) => (
  <Card>
    <CardBody>
      <StatGroup>
        <Stat>
          <StatLabel>{title}</StatLabel>
          <StatNumber>{number}</StatNumber>
          <StatHelpText>
            <StatArrow type={type} />
            {percentage}%
          </StatHelpText>
        </Stat>
      </StatGroup>
    </CardBody>
  </Card>
);

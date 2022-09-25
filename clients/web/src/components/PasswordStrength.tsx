import { Progress } from '@chakra-ui/react';
import * as React from 'react';

type PasswordStrengthIndicatorProps = {
  strength?: number;
};

type PasswordStrengthColorMap = {
  [key: number]: 'gray' | 'red' | 'yellow' | 'green';
};

const passwordStrengthColorMap = {
  0: 'red',
  1: 'red',
  2: 'yellow',
  3: 'green',
  4: 'green',
} as PasswordStrengthColorMap;

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strength = 0 }) => (
  <Progress
    size="sm"
    value={strength}
    max={4}
    min={0}
    borderRadius={5}
    mt={2}
    colorScheme={passwordStrengthColorMap[strength]}
    sx={{
      '& > div:first-of-type': {
        transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
        transitionDuration: '.2s, .2s, .35s',
        transitionProperty: 'width',
        transitionTimingFunction: 'linear, linear, ease',
      },
    }}
  />
);

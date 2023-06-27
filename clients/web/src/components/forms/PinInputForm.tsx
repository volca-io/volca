import { HStack, PinInput, PinInputField } from '@chakra-ui/react';
import React from 'react';

interface FormProps {
  code: string;
}

interface PinInputFormProps {
  onSubmit: (data: FormProps) => void;
}

export const PinInputForm: React.FC<PinInputFormProps> = ({ onSubmit }) => {
  return (
    <form>
      <HStack>
        <PinInput
          otp
          size="lg"
          onComplete={(val) => {
            onSubmit({ code: val });
          }}
        >
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
    </form>
  );
};

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { Alert as AlertContent } from '../../types';

interface FormProps {
  toUserEmail: string;
  projectId: string;
}

type InviteProjectUserProps = {
  alert?: AlertContent;
  onSubmit: (data: FormProps) => void;
};

const InviteProjectUser: React.FC<InviteProjectUserProps> = ({ alert, onSubmit }) => {
  const { register, handleSubmit } = useForm<FormProps>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup size="md">
        <Input
          backgroundColor={'white'}
          type="text"
          {...register('toUserEmail', { required: true })}
          placeholder="Invite user e-mail"
        />
        <InputRightElement width="4.5rem">
          <Button colorScheme={'blue'} size="md" type="submit">
            Invite
          </Button>
        </InputRightElement>
      </InputGroup>
      {alert && (
        <Alert status={alert.status}>
          <AlertIcon />
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default InviteProjectUser;

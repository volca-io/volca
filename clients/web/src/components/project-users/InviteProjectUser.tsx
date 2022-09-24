import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Input, InputGroup } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdPersonAddAlt1 } from 'react-icons/md';

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
        <Input type="text" {...register('toUserEmail', { required: true })} placeholder="Invite user e-mail" />
        <Button rightIcon={<MdPersonAddAlt1 />} px={6} size="md" ml={2} type="submit">
          Invite
        </Button>
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

import { Button, Input, InputGroup } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { Entity, Operation } from '../../hooks/roles';
import { PrivilegeContainer } from '../generic/PrivilegeContainer';

interface FormProps {
  toUserEmail: string;
  projectId: string;
}

type InviteProjectUserProps = {
  onSubmit: (data: FormProps) => void;
};

export const InviteProjectUser: React.FC<InviteProjectUserProps> = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm<FormProps>();
  return (
    <PrivilegeContainer entity={Entity.PROJECT_USERS} operation={Operation.CREATE}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup size="md">
          <Input type="text" {...register('toUserEmail', { required: true })} placeholder="Invite user e-mail" />
          <Button rightIcon={<MdPersonAddAlt1 />} px={6} size="md" ml={2} type="submit">
            Invite
          </Button>
        </InputGroup>
      </form>
    </PrivilegeContainer>
  );
};

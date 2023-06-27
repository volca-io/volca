import { InputGroup, IconButton } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { Entity, Operation } from '../../hooks/roles';
import { PrivilegeContainer } from '../generic/PrivilegeContainer';

interface FormProps {
  projectId: string;
}

type InviteProjectUserProps = {
  onSubmit: (data: FormProps) => void;
};

export const InviteProjectUser: React.FC<InviteProjectUserProps> = ({ onSubmit }) => {
  const { handleSubmit } = useForm<FormProps>();
  return (
    <PrivilegeContainer entity={Entity.PROJECT_USERS} operation={Operation.CREATE}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup size="md">
          <IconButton aria-label="Create invitation link" icon={<MdPersonAddAlt1 />} px={6} size="md" type="submit" />
        </InputGroup>
      </form>
    </PrivilegeContainer>
  );
};

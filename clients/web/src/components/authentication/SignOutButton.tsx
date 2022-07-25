import { MenuItem } from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { ApiClient } from '../../lib/clients/api-client';
import { currentUser } from '../../state';

interface SignOutButtonProps {
  children: React.ReactNode;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ children }) => {
  const [, setUser] = useRecoilState(currentUser);

  const onClick = async () => {
    await ApiClient.signOut();
    setUser(null);
  };

  return <MenuItem onClick={onClick}>{children}</MenuItem>;
};

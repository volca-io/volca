import { MenuItem } from '@chakra-ui/react';
import React from 'react';
import { useUserActions } from '../../hooks';

interface SignOutButtonProps {
  children: React.ReactNode;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ children }) => {
  const { signOut } = useUserActions();

  return <MenuItem onClick={signOut}>{children}</MenuItem>;
};

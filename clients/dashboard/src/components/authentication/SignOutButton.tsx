import { MenuItem } from '@chakra-ui/react';
import React from 'react';
import { useAuthContext } from '../../providers';
import { MdLogout } from 'react-icons/md';

interface SignOutButtonProps {
  children: React.ReactNode;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ children }) => {
  const { signOut } = useAuthContext();
  
  return <MenuItem onClick={signOut} icon={<MdLogout />}>{children}</MenuItem>;
};

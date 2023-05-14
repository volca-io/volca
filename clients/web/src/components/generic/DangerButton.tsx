import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { ReactElement } from 'react';

export const DangerButton = ({
  title,
  icon,
  onClick,
  body,
  ...rest
}: {
  title: string;
  icon?: ReactElement<any>;
  onClick: () => void;
  body: string;
} & ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button {...rest} w={'auto'} onClick={onOpen} leftIcon={icon} colorScheme="red">
        {title}
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClick} ml={3} colorScheme="red">
                {title}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

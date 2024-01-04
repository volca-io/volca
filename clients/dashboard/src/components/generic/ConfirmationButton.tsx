import { ReactElement } from 'react';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';

type ConfirmationButtonProps = {
  title: string;
  description: string;
  confirmationTitle?: string;
  onConfirm: () => void;
  triggerElement: ReactElement;
  isLoading?: boolean;
};

export const ConfirmationButton = ({
  title,
  description,
  confirmationTitle = 'Confirm',
  triggerElement,
  onConfirm,
  isLoading = false,
}: ConfirmationButtonProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const _onConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="right" closeOnBlur={false}>
      <PopoverTrigger>{triggerElement}</PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>{title}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>{description}</PopoverBody>
          <PopoverFooter>
            <Button colorScheme="red" onClick={_onConfirm} isLoading={isLoading}>
              {confirmationTitle}
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

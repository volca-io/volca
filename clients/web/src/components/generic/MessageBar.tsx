import { Alert, CloseButton, Flex, useDisclosure } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { message as messageState } from '../../state/message';

export const MessageBar = ({ full }: { full: boolean }) => {
  const [message, setMessage] = useRecoilState(messageState);
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  return message && isVisible ? (
    <Alert
      display="flex"
      justifyContent="space-between"
      flexDir="row"
      ml={{ base: 0, md: full ? 0 : 60 }}
      status="info"
      {...(full ? {} : { w: 'calc(100% - 240px)' })}
    >
      <Flex>{message}</Flex>
      <Flex>
        <CloseButton
          alignSelf="flex-end"
          onClick={() => {
            setMessage('');
            onClose();
          }}
        />
      </Flex>
    </Alert>
  ) : null;
};

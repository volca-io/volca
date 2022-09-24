import { Alert, AlertTitle, AlertDescription, AlertIcon, Box, CloseButton } from '@chakra-ui/react';

type AlertBoxProps = {
  status: 'info' | 'warning' | 'success' | 'error' | 'loading';
  title: string;
  description: string;
  onClose: () => void;
};

export const AlertBox: React.FC<AlertBoxProps> = ({ status, title, description, onClose }) => (
  <Alert status={status} mb={5}>
    <AlertIcon />
    <Box>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description} </AlertDescription>
    </Box>
    <CloseButton alignSelf="flex-start" position="absolute" right={0} top={0} onClick={onClose} />
  </Alert>
);

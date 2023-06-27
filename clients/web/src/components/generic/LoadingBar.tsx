import { Progress } from '@chakra-ui/react';
import { useLoadingContext } from '../../providers';

export const LoadingBar = ({ full }: { full: boolean }) => {
  const { loading } = useLoadingContext();

  const props = loading ? {} : { display: 'none' };

  return <Progress {...props} ml={{ base: 0, md: full ? 0 : 60 }} mb={-1} zIndex={1000} size="xs" isIndeterminate />;
};

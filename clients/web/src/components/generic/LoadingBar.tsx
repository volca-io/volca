import { Progress } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { loadingState } from '../../state';

export const LoadingBar = ({ full }: { full: boolean }) => {
  const loading = useRecoilValue(loadingState);

  const props = loading ? {} : { display: 'none' };

  return <Progress {...props} ml={{ base: 0, md: full ? 0 : 60 }} mb={-1} zIndex={1000} size="xs" isIndeterminate />;
};

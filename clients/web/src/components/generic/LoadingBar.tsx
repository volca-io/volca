import { Progress } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { loading as loadingState } from '../../state/loading';

export const LoadingBar = ({ full }: { full: boolean }) => {
  const [loading] = useRecoilState(loadingState);

  const props = loading ? {} : { display: 'none' };

  return <Progress {...props} ml={{ base: 0, md: full ? 0 : 60 }} size="xs" isIndeterminate />;
};

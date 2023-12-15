import { Navigate } from 'react-router-dom';
import { useProjectContext } from '../../providers';

export const HasSelectedProjectGuard = ({ children }: { children: React.ReactNode }) => {
  const { selectedProject } = useProjectContext();

  if (!selectedProject) {
    return <Navigate to="/projects" />;
  }

  if (!selectedProject.owner.hasActiveSubscription) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

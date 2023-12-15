import { Outlet } from 'react-router-dom';

type GuardNode = ({ children }: { children: React.ReactElement }) => React.ReactNode;

type GuardedRouteProps = {
  layout: ({ children }: { children: React.ReactElement }) => React.ReactNode;
  guards?: Array<GuardNode>;
};

const CombinedGuards = ({ guards }: { guards: Array<GuardNode> }) => {
  const Guard = guards[0];
  return <Guard>{guards.length > 1 ? <CombinedGuards guards={guards.slice(1)} /> : <Outlet />}</Guard>;
};

export const GuardedRoute: React.FC<GuardedRouteProps> = ({ layout: Layout, guards = [] }) => {
  return (
    <Layout>
      <CombinedGuards guards={guards} />
    </Layout>
  );
};

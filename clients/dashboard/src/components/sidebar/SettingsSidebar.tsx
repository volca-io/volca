import { MdArrowBack, MdPerson, MdWallet } from 'react-icons/md/index.js';
import { Sidebar } from './Sidebar';
import { useProjectContext } from '../../providers';

type SettingsSidebarProps = {
  onClose: () => void;
};

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ onClose }) => {
  const { selectedProject } = useProjectContext();

  return (
    <Sidebar
      onClose={onClose}
      sections={[
        {
          items: [
            {
              name: 'Back to project',
              to: `/projects/${selectedProject?.id}/dashboard`,
              icon: MdArrowBack,
            },
          ],
        },
        {
          name: 'Account',
          items: [
            {
              name: 'Profile',
              to: '/settings/profile',
              icon: MdPerson,
            },
            {
              name: 'Billing',
              to: '/settings/billing',
              icon: MdWallet,
            },
          ],
        },
      ]}
    />
  );
};

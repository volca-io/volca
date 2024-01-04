import { MdFileUpload, MdHomeFilled, MdGroups3, MdSettings } from 'react-icons/md/index.js';
import { Sidebar } from './Sidebar';
import { useProjectContext } from '../../providers';

type ProjectSidebarProps = {
  onClose: () => void;
};

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ onClose }) => {
  const { selectedProject } = useProjectContext();

  return (
    <Sidebar
      onClose={onClose}
      sections={[
        {
          items: [
            {
              name: 'Dashboard',
              to: `/projects/${selectedProject?.id}/dashboard`,
              icon: MdHomeFilled,
            },
            {
              name: 'Files',
              to: `/projects/${selectedProject?.id}/files`,
              icon: MdFileUpload,
            },
            {
              name: 'Users',
              to: `/projects/${selectedProject?.id}/users`,
              icon: MdGroups3,
            },
            {
              name: 'Settings',
              to: `/projects/${selectedProject?.id}/settings`,
              icon: MdSettings,
            },
          ],
        },
      ]}
    />
  );
};

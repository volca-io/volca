import React from 'react';
import { IconType } from 'react-icons';
import { SidebarLayout } from './sidebar';
import { ProjectSidebar } from '../components/sidebar/ProjectSidebar';

interface ProjectLayoutProps {
  children: React.ReactNode;
  title?: string;
  icon?: IconType;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  return <SidebarLayout sidebar={ProjectSidebar}>{children}</SidebarLayout>;
};

import React from 'react';
import { IconType } from 'react-icons';
import { SidebarLayout } from './sidebar';
import { SettingsSidebar } from '../components/sidebar/SettingsSidebar';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title?: string;
  icon?: IconType;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return <SidebarLayout sidebar={SettingsSidebar}>{children}</SidebarLayout>;
};

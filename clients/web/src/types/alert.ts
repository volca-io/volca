export type Alert = {
  title: string;
  message: string;
  status: 'error' | 'success' | 'warning' | 'info';
};

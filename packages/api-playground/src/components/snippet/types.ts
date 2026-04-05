import { IconType } from 'react-icons';

export type Tab = {
  id: string;
  label: string;
};

export type Action = {
  id: string;
  label: string;
  Icon?: IconType;
  type?: 'cta' | 'icon';
  disabled?: boolean;
};

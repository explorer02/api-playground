import { IconType } from 'react-icons';

export type Tab = {
  id: string;
  label: string;
};

export type Action = {
  id: string;
  label: string;
  Icon?: IconType;
  cta?: boolean;
};

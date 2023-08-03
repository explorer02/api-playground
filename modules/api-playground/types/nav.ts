import { ComponentType } from 'react';
import { Game } from '../constants/game';

export type NavItem = {
  id: Game;
  label: string;
  Component: ComponentType;
  children?: {
    id: string;
    label: string;
    Component: ComponentType;
  }[];
};

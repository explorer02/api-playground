'use client';

import { APIPlayground } from '@/APIPlayground';
import { SnackbarProvider } from '@/context/SnackbarContext';

import { APIPlaygroundProps } from '@/types';

import './styles.css';
import './tailwind.css';

export const ContainerWithStyles = (props: APIPlaygroundProps): JSX.Element => {
  return (
    <SnackbarProvider>
      <APIPlayground {...props} />
    </SnackbarProvider>
  );
};

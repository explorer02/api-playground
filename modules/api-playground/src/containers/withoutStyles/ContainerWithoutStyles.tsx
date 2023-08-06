'use client';

import { APIPlayground } from '@/APIPlayground';
import { SnackbarProvider } from '@/context/SnackbarContext';

import { APIPlaygroundProps } from '@/types';

export const ContainerWithoutStyles = (props: APIPlaygroundProps): JSX.Element => {
  return (
    <SnackbarProvider>
      <APIPlayground {...props} />
    </SnackbarProvider>
  );
};

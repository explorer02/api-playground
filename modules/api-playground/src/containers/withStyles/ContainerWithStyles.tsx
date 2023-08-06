'use client';

import SpacewebProvider from '@sprinklrjs/spaceweb/spacewebProvider';
import light from '@sprinklrjs/spaceweb-themes/hyperspace/light';
import { StyleProvider } from '@sprinklrjs/spaceweb/styleEngine';

import '@sprinklrjs/spaceweb-themes/hyperspace/themeVars.min.css';
import '@sprinklrjs/spaceweb-themes/utilities.min.css';
import '@sprinklrjs/spaceweb-themes/styles/normalize.min.css';
import '@sprinklrjs/spaceweb-themes/styles/globals.min.css';

import { APIPlayground } from '@/APIPlayground';
import { SnackbarProvider } from '@/context/SnackbarContext';

import { APIPlaygroundProps } from '@/types';

export const ContainerWithStyles = (props: APIPlaygroundProps): JSX.Element => {
  return (
    <SpacewebProvider direction="ltr" theme={light}>
      <StyleProvider>
        <SnackbarProvider>
          <APIPlayground {...props} />
        </SnackbarProvider>
      </StyleProvider>
    </SpacewebProvider>
  );
};

'use client';

import SpacewebProvider from '@sprinklrjs/spaceweb/spacewebProvider';
import light from '@sprinklrjs/spaceweb-themes/hyperspace/light';
import { StyleProvider } from '@sprinklrjs/spaceweb/styleEngine';

import '@sprinklrjs/spaceweb-themes/hyperspace/themeVars.min.css';
import '@sprinklrjs/spaceweb-themes/utilities.min.css';
import '@sprinklrjs/spaceweb-themes/styles/normalize.min.css';
import '@sprinklrjs/spaceweb-themes/styles/globals.min.css';

import { Box } from '@sprinklrjs/spaceweb/box';
import { APIPlayground } from 'modules/api-playground';

export const PageWrapper = (): JSX.Element => {
  return (
    <SpacewebProvider direction="ltr" theme={light}>
      <StyleProvider>
        <Box className="h-screen p-16">
          <APIPlayground />
        </Box>
      </StyleProvider>
    </SpacewebProvider>
  );
};

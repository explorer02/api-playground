'use client';

import { ApolloProvider } from '@apollo/client';

import { APIPlayground } from '@explorer02/api-playground';
import '@explorer02/api-playground/styles/index.scss';

import { TEMPLATE_CONFIG } from '../config';
import { CLIENT } from '../constants';
import { MyComponent } from '../MyComponent';

const Page = (): JSX.Element | null => {
  return (
    <ApolloProvider client={CLIENT}>
      <div
        style={{ background: '#dddddd55', height: '100vh', padding: '40px', display: 'flex', flexDirection: 'column' }}
      >
        <MyComponent />
        <div style={{ flex: 1, minHeight: 0 }}>
          <APIPlayground config={TEMPLATE_CONFIG} />
        </div>
      </div>
    </ApolloProvider>
  );
};

export default Page;

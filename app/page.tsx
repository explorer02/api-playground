'use client';

import { ApolloProvider } from '@apollo/client';

import { APIPlayground } from '@/modules/api-playground/dist';

import { TEMPLATE_CONFIG } from './config';
import { CLIENT } from './constants';
import { MyComponent } from './MyComponent';

const Page = (): JSX.Element | null => {
  return (
    <div style={{ background: '#dddddd55', height: '100vh', padding: '40px' }}>
      <ApolloProvider client={CLIENT}>
        <MyComponent />
      </ApolloProvider>
      <APIPlayground config={TEMPLATE_CONFIG} />
    </div>
  );
};

export default Page;

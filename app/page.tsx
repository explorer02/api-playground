'use client';

import { ApolloProvider } from '@apollo/client';

import { APIPlayground } from '@/modules/api-playground/dist';

import { GAME_CONFIG } from './config';
import { CLIENT } from './constants';
import { MyComponent } from './MyComponent';

const InnerComponent = () => {
  return <APIPlayground config={GAME_CONFIG} className="h-screen p-16" />;
};

const Page = (): JSX.Element | null => {
  return (
    <div style={{ background: '#dddddd55' }}>
      <ApolloProvider client={CLIENT}>
        <MyComponent />
      </ApolloProvider>
      <InnerComponent />
    </div>
  );
};

export default Page;

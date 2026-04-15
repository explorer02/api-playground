import { CodeBlock } from './CodeBlock';

const CODE = `import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { APIPlayground, Template } from '@explorer02/api-playground';
import '@explorer02/api-playground/dist/index.css';

const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql',
  cache: new InMemoryCache(),
});

const config = [
  {
    id: 'queries',
    type: Template.QUERY_EXECUTOR,
    title: 'Query Executor',
    client,
  },
];

export default function App() {
  return (
    <ApolloProvider client={client}>
      <APIPlayground config={config} />
    </ApolloProvider>
  );
}`;

export function QuickStart() {
  return (
    <section className="max-w-[1120px] mx-auto px-4 md:px-8 py-12 md:py-[72px]">
      <h2 className="text-center text-2xl md:text-[32px] font-bold tracking-tight text-gray-900">Quick Start</h2>
      <p className="text-center mt-3 mb-8 md:mb-10 text-base text-gray-500">Get up and running in under a minute.</p>
      <div className="max-w-3xl mx-auto">
        <CodeBlock code={CODE} />
      </div>
    </section>
  );
}

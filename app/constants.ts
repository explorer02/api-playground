import { ApolloClient, InMemoryCache } from '@apollo/client';

export const CLIENT = new ApolloClient({
  // uri: 'https://spacex-production.up.railway.app/',
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

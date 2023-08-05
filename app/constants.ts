import { ApolloClient, InMemoryCache } from '@apollo/client';

export const CLIENT = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

import { gql, useLazyQuery } from '@apollo/client';
import { parse, print } from 'graphql/language';
import { CLIENT } from './constants';

const FRAGMENT = gql`
  fragment Character on Character {
    id
    name
  }
`;

const FETCH_CHARACTERS = gql`
  query BroFetchChars($page: Int) {
    characters(page: $page) {
      results {
        ...Character
      }
    }
  }
  ${FRAGMENT}
`;

// console.log(print(FETCH_CHARACTERS), print(parse(TEMP)));

export const MyComponent = () => {
  const [fetcher, { data, loading }] = useLazyQuery(FETCH_CHARACTERS);

  // console.log({
  //   data,
  //   loading,
  //   cache: CLIENT.cache.extract(),
  //   CLIENT,
  //   parsedQuery: CLIENT.queryManager.queries.size ? print([...CLIENT.queryManager.queries][0][1].document) : undefined,
  // });

  // console.log(CLIENT.queryManager.queries.size ? print([...CLIENT.queryManager.queries][0][1].document) : undefined);

  // console.log(CLIENT.queryManager.queries.size ? [...CLIENT.queryManager.queries][0][1].variables : undefined);

  const onFetch = () => {
    const randomPage = Math.floor(Math.random() * 20);
    fetcher({
      variables: {
        page: randomPage,
      },
    });
  };

  return (
    <button className="border-solid border-1 padding-4" onClick={onFetch}>
      Click Me
    </button>
  );
};

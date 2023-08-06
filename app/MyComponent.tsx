import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useState } from 'react';

const FRAGMENT_CHARACTER = gql`
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
  ${FRAGMENT_CHARACTER}
`;

const FRAGMENT_LOCATION = gql`
  fragment Location on Location {
    id
    name
  }
`;

const FETCH_LOCATIONS = gql`
  query FetchLocations($page: Int) {
    locations(page: $page) {
      results {
        ...Location
      }
    }
  }
  ${FRAGMENT_LOCATION}
`;

// console.log(print(FETCH_CHARACTERS), print(parse(TEMP)));

const MyComponent = () => {
  const [charFetcher, charResult] = useLazyQuery(FETCH_CHARACTERS, { ssr: false });
  const [locFetcher, locResult] = useLazyQuery(FETCH_LOCATIONS, { ssr: false });

  const { data } = useQuery(FETCH_LOCATIONS, { variables: { page: 4 } });
  useQuery(FETCH_LOCATIONS, { variables: { page: 4 } });

  const onFetchChars = () => {
    const randomPage = Math.floor(Math.random() * 20);
    charFetcher({
      variables: {
        page: 4 || randomPage,
      },
    });
  };
  const onFetchLocations = () => {
    const randomPage = Math.floor(Math.random() * 20);
    locFetcher({
      variables: {
        page: 4 || randomPage,
      },
    });
  };

  return (
    <>
      <button
        onClick={onFetchChars}
        style={{ border: '1px solid', padding: '12px', background: 'blue', color: 'white', borderRadius: '8px' }}
      >
        Fetch Chars
      </button>
      <button
        onClick={onFetchLocations}
        style={{ border: '1px solid', padding: '12px', background: 'blue', color: 'white', borderRadius: '8px' }}
      >
        Fetch locs
      </button>
      <div>{JSON.stringify(data ?? {})}</div>
    </>
  );
};

const Wrapper = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <MyComponent key={count} />
      <button
        onClick={() => setCount(c => c + 1)}
        style={{ border: '1px solid', padding: '12px', background: 'blue', color: 'white', borderRadius: '8px' }}
      >
        Click To ReRender
      </button>
    </>
  );
};

export { Wrapper as MyComponent };

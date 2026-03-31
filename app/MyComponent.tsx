'use client';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useState } from 'react';

const FRAGMENT_CHARACTER = gql`
  fragment Character on Character {
    id
    name
    status
    species
  }
`;

const FETCH_CHARACTERS = gql`
  query FetchCharacters($page: Int) {
    characters(page: $page) {
      info {
        count
        pages
        next
      }
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
    type
    dimension
  }
`;

const FETCH_LOCATIONS = gql`
  query FetchLocations($page: Int) {
    locations(page: $page) {
      info {
        count
        pages
      }
      results {
        ...Location
      }
    }
  }
  ${FRAGMENT_LOCATION}
`;

const FETCH_EPISODES = gql`
  query FetchEpisodes($page: Int) {
    episodes(page: $page) {
      info {
        count
        pages
      }
      results {
        id
        name
        air_date
        episode
      }
    }
  }
`;

const buttonStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px 16px',
  background: '#0e61f6',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
};

const DataFetcher = () => {
  const [charPage, setCharPage] = useState(1);
  const [locPage, setLocPage] = useState(1);

  const [fetchChars, { data: charData, loading: charsLoading }] = useLazyQuery(FETCH_CHARACTERS);
  const [fetchLocs, { data: locData, loading: locsLoading }] = useLazyQuery(FETCH_LOCATIONS);
  const [fetchEps, { data: epData, loading: epsLoading }] = useLazyQuery(FETCH_EPISODES);

  // Pre-populate cache with a locations query so Cache Viewer has data on load
  useQuery(FETCH_LOCATIONS, { variables: { page: 1 } });

  const handleFetchChars = () => {
    fetchChars({ variables: { page: charPage } });
    setCharPage(p => (p % 20) + 1);
  };

  const handleFetchLocs = () => {
    fetchLocs({ variables: { page: locPage } });
    setLocPage(p => (p % 7) + 1);
  };

  const handleFetchEpisodes = () => {
    fetchEps({ variables: { page: 1 } });
  };

  const charCount = charData?.characters?.results?.length ?? 0;
  const locCount = locData?.locations?.results?.length ?? 0;
  const epCount = epData?.episodes?.results?.length ?? 0;

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button onClick={handleFetchChars} style={buttonStyle} disabled={charsLoading}>
        {charsLoading ? 'Loading...' : `Fetch Characters${charCount ? ` (${charCount})` : ''}`}
      </button>
      <button onClick={handleFetchLocs} style={buttonStyle} disabled={locsLoading}>
        {locsLoading ? 'Loading...' : `Fetch Locations${locCount ? ` (${locCount})` : ''}`}
      </button>
      <button onClick={handleFetchEpisodes} style={buttonStyle} disabled={epsLoading}>
        {epsLoading ? 'Loading...' : `Fetch Episodes${epCount ? ` (${epCount})` : ''}`}
      </button>
    </div>
  );
};

const Wrapper = () => {
  const [key, setKey] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
      <DataFetcher key={key} />
      <button onClick={() => setKey(k => k + 1)} style={{ ...buttonStyle, background: '#666' }}>
        Reset
      </button>
    </div>
  );
};

export { Wrapper as MyComponent };

import { gql } from '@apollo/client';
import {
  FieldConfigMapBuilder,
  FormFieldType,
  Language,
  Template,
  TemplateConfig,
  CustomTemplateConfig,
  SchemaViewerConfig,
} from '@explorer02/api-playground';
import { CLIENT } from './constants';

type FormValues = Record<string, string | number>;

// ─── Queries ────────────────────────────────────────────────────────────────

const FETCH_LOCATIONS = gql`
  query FetchLocations($page: Int) {
    locations(page: $page) {
      results {
        id
        name
        type
        dimension
      }
    }
  }
`;

const FETCH_CHARACTERS = gql`
  query FetchCharacters($page: Int) {
    characters(page: $page) {
      results {
        id
        name
        status
        species
      }
    }
  }
`;

const FETCH_EPISODES = gql`
  query FetchEpisodes($page: Int) {
    episodes(page: $page) {
      results {
        id
        name
        air_date
        episode
      }
    }
  }
`;

// Note: Rick and Morty API is read-only, so these "mutations" are actually queries
// used to demonstrate the mutation UI flow
const CREATE_LOCATION = gql`
  query CreateLocation($page: Int) {
    locations(page: $page) {
      results {
        id
        name
      }
    }
  }
`;

// ─── Custom Component ───────────────────────────────────────────────────────

const AboutPanel = () => (
  <div style={{ padding: '24px', height: '100%' }}>
    <h2 style={{ margin: '0 0 12px' }}>API Playground</h2>
    <p style={{ color: '#666', lineHeight: 1.6 }}>
      A React component library for interactive GraphQL API exploration.
      <br />
      Built with Apollo Client, Monaco Editor, and TypeScript.
    </p>
    <ul style={{ color: '#666', lineHeight: 1.8, paddingLeft: '20px' }}>
      <li>Execute queries and mutations with live results</li>
      <li>Inspect and edit the Apollo cache</li>
      <li>Build form-driven query workflows</li>
      <li>View static configuration data</li>
    </ul>
  </div>
);

// ─── Shared field configs ───────────────────────────────────────────────────

const pageFieldConfig = new FieldConfigMapBuilder()
  .addField({
    id: 'page',
    label: 'Page No.',
    type: FormFieldType.NUMBER,
    required: true,
    placeholder: 'Enter page (1-42)',
  })
  .addField({
    id: 'data',
    label: 'Extra Data',
    type: FormFieldType.JSON,
  })
  .build();

const pageValidator = (vals: Record<string, string | number>) => {
  const errors: Record<string, string> = {};
  const page = Number(vals.page);
  if (isNaN(page) || page < 1 || page > 42) {
    errors.page = 'Page must be between 1 and 42';
  }
  return errors;
};

// ─── Template Config ────────────────────────────────────────────────────────

export const TEMPLATE_CONFIG: TemplateConfig[] = [
  // 1. STATIC_DATA - basic JSON object
  {
    id: 'current_user',
    type: Template.STATIC_DATA,
    title: 'Current User',
    data: {
      name: 'Ajay Bhardwaj',
      role: 'Developer',
      preferences: {
        theme: 'light',
        language: 'en',
      },
    },
  },

  // 2. STATIC_DATA - GraphQL schema snippet with language highlighting + readOnly
  {
    id: 'schema_info',
    type: Template.STATIC_DATA,
    title: 'Schema Info',
    data: `type Character {
  id: ID!
  name: String!
  status: String
  species: String
  type: String
  gender: String
  origin: Location
  location: Location
  image: String
  episode: [Episode]!
}

type Location {
  id: ID!
  name: String
  type: String
  dimension: String
  residents: [Character]
}

type Query {
  characters(page: Int, filter: FilterCharacter): Characters
  locations(page: Int, filter: FilterLocation): Locations
  episodes(page: Int, filter: FilterEpisode): Episodes
}`,
    language: Language.GRAPHQL,
    readOnly: true,
  },

  // 3. CACHE_VIEWER
  {
    id: 'apollo_cache',
    type: Template.CACHE_VIEWER,
    title: 'Cache Viewer',
    client: CLIENT,
  },

  // 4. QUERY_EXECUTOR with custom titles
  {
    id: 'query_executor',
    type: Template.QUERY_EXECUTOR,
    title: 'Query Executor',
    client: CLIENT,
    config: {
      input: { title: 'GraphQL Query' },
      variable: { title: 'Variables (JSON)' },
      output: { title: 'Response', readOnly: true },
    },
  },

  // 5. MUTATION_EXECUTOR with preset mutations
  {
    id: 'mutation_executor',
    type: Template.MUTATION_EXECUTOR,
    title: 'Mutation Executor',
    client: CLIENT,
    mutations: [
      {
        id: 'create_location',
        label: 'Create Location (page 1)',
        node: CREATE_LOCATION,
        variables: { page: 1 },
      },
      {
        id: 'create_location_p2',
        label: 'Create Location (page 2)',
        node: CREATE_LOCATION,
        variables: { page: 2 },
      },
    ],
  },

  // 6. CUSTOM_QUERY with validation and initial values
  {
    id: 'custom_query',
    type: Template.CUSTOM_QUERY,
    title: 'Custom Query',
    client: CLIENT,
    query: FETCH_LOCATIONS,
    fieldConfigMap: pageFieldConfig,
    formLayout: { fields: ['page', 'data'] },
    initialValues: { page: 1 },
    validator: pageValidator,
    getVariables: (obj: FormValues) => ({ page: Number(obj.page) }),
    outputConfig: { readOnly: true },
  },

  // 7. CUSTOM_MUTATION with initial values
  {
    id: 'custom_mutation',
    type: Template.CUSTOM_MUTATION,
    title: 'Custom Mutation',
    client: CLIENT,
    mutation: CREATE_LOCATION,
    fieldConfigMap: pageFieldConfig,
    formLayout: { fields: ['page', 'data'] },
    initialValues: { page: 4 },
    validator: pageValidator,
    getVariables: (obj: FormValues) => ({ page: Number(obj.page) }),
  },

  // 8. FETCH_AND_MUTATE
  {
    id: 'fetch_and_mutate',
    type: Template.FETCH_AND_MUTATE,
    title: 'Fetch And Mutate',
    client: CLIENT,
    fetchConfig: {
      fieldConfigMap: pageFieldConfig,
      formLayout: { fields: ['page', 'data'] },
      initialValues: { page: 1 },
      validator: pageValidator,
      getVariables: (obj: FormValues) => ({ page: Number(obj.page) }),
      query: FETCH_LOCATIONS,
      cta: { label: 'Fetch Locations' },
      output: { title: 'Fetch Result' },
    },
    mutateConfig: {
      mutation: CREATE_LOCATION,
      getVariables: (formValues: FormValues, _queryResponse: object) => ({
        page: Number(formValues.page),
      }),
      output: { title: 'Mutation Result' },
    },
  },

  // 9. NESTED_TEMPLATE - groups related executors
  {
    id: 'nested_executors',
    type: Template.NESTED_TEMPLATE,
    title: 'Grouped Queries',
    templates: [
      {
        id: 'nested_characters',
        type: Template.CUSTOM_QUERY,
        title: 'Characters',
        client: CLIENT,
        query: FETCH_CHARACTERS,
        fieldConfigMap: new FieldConfigMapBuilder()
          .addField({
            id: 'page',
            label: 'Page',
            type: FormFieldType.NUMBER,
            required: true,
          })
          .build(),
        formLayout: { fields: ['page'] },
        initialValues: { page: 1 },
        getVariables: (obj: FormValues) => ({ page: Number(obj.page) }),
      },
      {
        id: 'nested_episodes',
        type: Template.CUSTOM_QUERY,
        title: 'Episodes',
        client: CLIENT,
        query: FETCH_EPISODES,
        fieldConfigMap: new FieldConfigMapBuilder()
          .addField({
            id: 'page',
            label: 'Page',
            type: FormFieldType.NUMBER,
            required: true,
          })
          .build(),
        formLayout: { fields: ['page'] },
        initialValues: { page: 1 },
        getVariables: (obj: FormValues) => ({ page: Number(obj.page) }),
      },
    ],
  },

  // 10. CUSTOM - renders a custom React component
  {
    id: 'about',
    type: Template.CUSTOM,
    title: 'About',
    Component: AboutPanel,
  } as CustomTemplateConfig,

  // 11. SCHEMA_VIEWER - introspection schema display
  {
    id: 'schema_viewer',
    type: Template.SCHEMA_VIEWER,
    title: 'Schema',
    client: CLIENT,
  } as SchemaViewerConfig,

  // 12. REST_API - REST endpoint testing
  {
    id: 'rest_api',
    type: Template.REST_API,
    title: 'REST API',
    defaultUrl: 'https://jsonplaceholder.typicode.com/posts/1',
    defaultMethod: 'GET',
    defaultHeaders: { 'Content-Type': 'application/json' },
  },

  // 13. SSE - Server-Sent Events streaming
  {
    id: 'sse',
    type: Template.SSE,
    title: 'SSE Stream',
    url: 'https://stream.wikimedia.org/v2/stream/recentchange',
  },

  // 14. REST_WEBSOCKET - Raw WebSocket client
  {
    id: 'rest_websocket',
    type: Template.REST_WEBSOCKET,
    title: 'WebSocket',
    url: 'wss://ws.postman-echo.com/raw',
  },

  // 15. GQL_SUBSCRIPTION - GraphQL subscriptions over WebSocket
  {
    id: 'gql_subscription',
    type: Template.GQL_SUBSCRIPTION,
    title: 'GQL Subscription',
    wsUrl: 'wss://demo-router.fly.dev/graphql',
    query: `subscription {
  currentTime {
    unixTime
  }
}`,
    variables: '{}',
  },
];

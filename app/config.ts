import { gql } from '@apollo/client';
import { FieldConfigMapBuilder, FormFieldType, Template, TemplateConfig } from '@/modules/api-playground';
import { CLIENT } from './constants';

const FETCH_LOCATIONS = gql`
  query FetchLocations($page: Int) {
    locations(page: $page) {
      results {
        id
        name
      }
    }
  }
`;

const CREATE_LOCATIONS = gql`
  query CreateLocation($page: Int) {
    createLocation(page: $page) {
      results {
        id
        name
      }
    }
  }
`;

export const TEMPLATE_CONFIG: TemplateConfig[] = [
  {
    id: 'current_user',
    type: Template.STATIC_DATA,
    data: {
      name: 'Ajay Bhardwaj',
      age: 24,
    },
    title: 'Current User',
  },
  {
    id: 'apollo_cache',
    type: Template.CACHE_VIEWER,
    title: 'Cache Viewer',
    client: CLIENT,
    // readOnly: true,
  },
  {
    id: 'query_executor',
    type: Template.QUERY_EXECUTOR,
    title: 'Query Executor',
    client: CLIENT,
  },
  {
    id: 'mutation_executor',
    type: Template.MUTATION_EXECUTOR,
    title: 'Mutation Executor',
    client: CLIENT,
  },
  {
    id: 'custom_query',
    type: Template.CUSTOM_QUERY,
    title: 'Custom Query',
    client: CLIENT,
    query: FETCH_LOCATIONS,
    fieldConfigMap: new FieldConfigMapBuilder()
      .addField({
        id: 'page',
        label: 'Page No.',
        type: FormFieldType.NUMBER,
        required: true,
      })
      .addField({
        id: 'data',
        label: 'Data',
        type: FormFieldType.JSON,
      })
      .build(),
    formLayout: { fields: ['page', 'data'] },
    getVariables: obj => {
      return { page: obj.page };
    },
  },
  {
    id: 'custom_mutation',
    type: Template.CUSTOM_MUTATION,
    title: 'Custom Mutation',
    client: CLIENT,
    mutation: CREATE_LOCATIONS,
    initialValues: {
      page: 4,
    },
    fieldConfigMap: new FieldConfigMapBuilder()
      .addField({
        id: 'page',
        label: 'Page No.',
        type: FormFieldType.NUMBER,
        required: true,
      })
      .addField({
        id: 'data',
        label: 'Data',
        type: FormFieldType.JSON,
      })
      .build(),
    formLayout: { fields: ['page', 'data'] },
    getVariables: obj => {
      return { page: obj.page };
    },
  },
  // {
  //   id: 'first',
  //   type: Template.NESTED_TEMPLATE,
  //   title: 'Rec',
  //   templates: [
  //     {
  //       id: 'mutation_executor',
  //       type: Template.MUTATION_EXECUTOR,
  //       title: 'Mutation Executor',
  //       client: CLIENT,
  //     },
  //     {
  //       id: 'mutation_executor2',
  //       type: Template.MUTATION_EXECUTOR,
  //       title: 'Mutation Executor',
  //       client: CLIENT,
  //     },
  //   ],
  // },
];

import { Template, TemplateConfig } from '@/modules/api-playground';
import { CLIENT } from './constants';

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
];

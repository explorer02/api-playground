import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client';

import { Template } from './constants/template';
import { Language } from './constants/language';

import { ClassName } from '@sprinklrjs/spaceweb';

type CommonConfig = {
  id: string;
  title: string;
};

export type StaticDataConfig = CommonConfig & {
  type: Template.STATIC_DATA;
  data: object | string;
  language?: Language;
  readOnly?: boolean;
};

export type CacheViewerConfig = CommonConfig & {
  type: Template.CACHE_VIEWER;
  client: ApolloClient<NormalizedCacheObject>;
  readOnly?: boolean;
};

export type QueryExecutorConfig = CommonConfig & {
  type: Template.QUERY_EXECUTOR;
  client: ApolloClient<NormalizedCacheObject>;
  config?: {
    input?: {
      title?: string;
    };
    variable?: {
      title?: string;
    };
    output?: {
      title?: string;
      readOnly?: boolean;
    };
  };
};

export type MutationExecutorConfig = CommonConfig & {
  type: Template.MUTATION_EXECUTOR;
  client: ApolloClient<NormalizedCacheObject>;
  config?: {
    input?: {
      title?: string;
    };
    variable?: {
      title?: string;
    };
    output?: {
      title?: string;
      readOnly?: boolean;
    };
  };
  mutations?: { id: string; label: string; node: DocumentNode; variables: object }[];
};

type PlainTemplates = StaticDataConfig | CacheViewerConfig | QueryExecutorConfig | MutationExecutorConfig;

export type NestedTemplateConfig = CommonConfig & {
  type: Template.NESTED_TEMPLATE;
  templates: PlainTemplates[];
};

export type TemplateConfig = PlainTemplates | NestedTemplateConfig;

export { ApolloClient };

export type APIPlaygroundProps = {
  config: TemplateConfig[];
  className?: ClassName;
};

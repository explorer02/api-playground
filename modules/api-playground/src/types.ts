import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client';

import { Template } from './constants/template';
import { Language } from './constants/language';

import { ClassName } from '@sprinklrjs/spaceweb';
import { FormFieldType } from './constants/formFieldTypes';
import { FormErrors, FormValues } from './components/form/types';

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

export type CustomQueryConfig = CommonConfig & {
  type: Template.CUSTOM_QUERY;
  formLayout: FormLayout;
  fieldConfigMap: FieldConfigMap;
  query: DocumentNode;
  getVariables: (o: FormValues) => object;
  validator?: (o: FormValues) => FormErrors;
  initialValues?: FormValues;
  client: ApolloClient<NormalizedCacheObject>;
  outputConfig?: {
    readOnly?: boolean;
  };
};

export type CustomMutationConfig = CommonConfig & {
  type: Template.CUSTOM_MUTATION;
  formLayout: FormLayout;
  fieldConfigMap: FieldConfigMap;
  mutation: DocumentNode;
  getVariables: (o: FormValues) => object;
  validator?: (o: FormValues) => FormErrors;
  initialValues?: FormValues;
  client: ApolloClient<NormalizedCacheObject>;
  outputConfig?: {
    readOnly?: boolean;
  };
};

type PlainTemplates =
  | StaticDataConfig
  | CacheViewerConfig
  | QueryExecutorConfig
  | MutationExecutorConfig
  | CustomQueryConfig
  | CustomMutationConfig;

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

/***************************** FORM CONFIG ***************************************/

export type FormLayout = {
  horizontal?: boolean;
  fields?: (string | FormLayout)[];
};

export type FieldConfig = {
  type: FormFieldType;
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
};

export type FieldConfigMap = Record<string, FieldConfig>;

/***************************** UTILITY TYPES ***************************************/

export type Action<Type extends string, Payload extends object | undefined = undefined> = Payload extends undefined
  ? { type: Type }
  : { type: Type; payload: Payload };

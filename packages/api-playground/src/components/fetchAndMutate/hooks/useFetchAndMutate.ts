//lib
import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { OnChange } from '@monaco-editor/react';

//components
import { VscSend } from 'react-icons/vsc';

//hooks
import { useValidateJSON } from '~/hooks/useValidateJSON';
import { useForm } from '~/components/form';
import { useGraphQLExecution } from '~/hooks/useGraphQLExecution';

//types
import { FetchAndMutateConfig } from '~/types';
import { FormValues } from '~/components/form/types';
import { Action } from '~/components/snippet/types';
import { MonacoEditorType } from '~/monaco';
import { OnFormAction } from '~/components/form/actionType';
import { ExecutionStatsData } from '~/components/executionStats/types';

type Params = {
  config: FetchAndMutateConfig;

  queryOutputEditorRef: MutableRefObject<MonacoEditorType | undefined>;
  mutationOutputEditorRef: MutableRefObject<MonacoEditorType | undefined>;
};

type ReturnType = {
  fetching: boolean;
  mutating: boolean;

  fetchStats: ExecutionStatsData | null;
  mutateStats: ExecutionStatsData | null;

  queryActions: Action[];
  onQueryActionClick: (action: string) => void;

  queryResponseErrors: boolean;
  handleQueryResponseChange: OnChange;

  onAction: OnFormAction;
  formValues: Record<string, string | number>;
  formErrors: Record<string, string>;
};

const EXECUTE_MUTATION = 'EXECUTE_MUTATION';

export const useFetchAndMutate = ({ config, mutationOutputEditorRef, queryOutputEditorRef }: Params): ReturnType => {
  const [isQueryExecuted, setIsQueryExecuted] = useState(false);

  const { errors: queryResponseErrors, handleChange: handleQueryResponseChange } = useValidateJSON();

  const {
    fetchConfig: { fieldConfigMap, initialValues, validator, getVariables: getQueryVariables, query, cta },
    mutateConfig: { getVariables: getMutationVariables, mutation },
    client,
  } = config;

  const fetchExecuteFn = useCallback(
    async (variables: any) => {
      const { data, error } = await client.query({ query, variables, fetchPolicy: 'network-only' });
      return { data, errorMessage: error?.message };
    },
    [client, query]
  );

  const mutateExecuteFn = useCallback(
    async (variables: any) => {
      const { data, errors } = await client.mutate({ mutation, variables });
      return { data, errorMessage: errors?.[0]?.message };
    },
    [client, mutation]
  );

  const {
    loading: fetching,
    stats: fetchStats,
    execute: executeFetch,
  } = useGraphQLExecution({ executeFn: fetchExecuteFn, outputEditorRef: queryOutputEditorRef });

  const {
    loading: mutating,
    stats: mutateStats,
    execute: executeMutate,
  } = useGraphQLExecution({ executeFn: mutateExecuteFn, outputEditorRef: mutationOutputEditorRef });

  const onFetchSubmit = useCallback(
    async (vals: FormValues) => {
      const variables = getQueryVariables(vals);
      const result = await executeFetch(variables);
      if (result) {
        setIsQueryExecuted(true);
      }
    },
    [getQueryVariables, executeFetch]
  );

  const {
    onAction,
    values: formValues,
    errors: formErrors,
  } = useForm({ fieldConfigMap, validator, initialValues, onSubmit: onFetchSubmit });

  const latestFormValuesRef = useRef(formValues);
  latestFormValuesRef.current = formValues;

  const onQueryActionClick = useCallback(
    async (action: string) => {
      switch (action) {
        case EXECUTE_MUTATION: {
          const mutationVariables = getMutationVariables(
            JSON.parse(queryOutputEditorRef.current!.getValue() ?? ''),
            latestFormValuesRef.current
          );
          await executeMutate(mutationVariables);
          break;
        }
        default:
          break;
      }
    },
    [getMutationVariables, queryOutputEditorRef, executeMutate]
  );

  const queryActions = useMemo<Action[]>(
    () => [
      {
        id: EXECUTE_MUTATION,
        label: cta?.label ?? 'Execute',
        Icon: VscSend,
        type: 'cta',
        disabled: !isQueryExecuted || queryResponseErrors,
      },
    ],
    [cta?.label, isQueryExecuted, queryResponseErrors]
  );

  return {
    fetching,
    mutating,

    fetchStats,
    mutateStats,

    queryActions,
    onQueryActionClick,

    queryResponseErrors,
    handleQueryResponseChange,

    onAction,
    formValues,
    formErrors,
  };
};

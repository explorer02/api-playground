//lib
import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { OnChange } from '@monaco-editor/react';

//components
import { VscSend } from 'react-icons/vsc';

//hooks
import { useValidateJSON } from '@/hooks/useValidateJSON';
import { useForm } from '@/components/form';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { FetchAndMutateConfig } from '@/types';
import { FormValues } from '@/components/form/types';
import { Action } from '@/components/snippet/types';
import { MonacoEditorType } from '@/monaco';
import { OnFormAction } from '@/components/form/actionType';
import { ExecutionStatsData } from '@/components/executionStats/types';

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
  const [fetching, setFetching] = useState(false);
  const [isQueryExecuted, setIsQueryExecuted] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [fetchStats, setFetchStats] = useState<ExecutionStatsData | null>(null);
  const [mutateStats, setMutateStats] = useState<ExecutionStatsData | null>(null);

  const { errors: queryResponseErrors, handleChange: handleQueryResponseChange } = useValidateJSON();

  const {
    fetchConfig: { fieldConfigMap, initialValues, validator, getVariables: getQueryVariables, query, cta },
    mutateConfig: { getVariables: getMutationVariables, mutation },

    client,
  } = config;

  const onFetchSubmit = useCallback(
    async (vals: FormValues) => {
      const variables = getQueryVariables(vals);
      setFetching(true);
      setFetchStats(null);
      const startTime = performance.now();
      try {
        const { data, error } = await client.query({ query, variables, fetchPolicy: 'network-only' });
        const result = prettifyJSON(data) ?? error?.message ?? '';
        queryOutputEditorRef.current?.setValue(result);
        setFetchStats({
          responseTimeMs: Math.round(performance.now() - startTime),
          payloadSizeBytes: new Blob([result]).size,
        });
        if (data) {
          setIsQueryExecuted(true);
        }
      } catch (e: unknown) {
        queryOutputEditorRef.current?.setValue(e instanceof Error ? e.message : 'Unknown error');
      }
      setFetching(false);
    },
    [client, getQueryVariables, queryOutputEditorRef, query]
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
        case EXECUTE_MUTATION:
          try {
            const mutationVariables = getMutationVariables(
              JSON.parse(queryOutputEditorRef.current!.getValue() ?? ''),
              latestFormValuesRef.current
            );
            setMutating(true);
            setMutateStats(null);
            const mutStart = performance.now();
            const { data, errors } = await client.mutate({ mutation, variables: mutationVariables });
            const mutResult = prettifyJSON(data) ?? errors?.[0]?.message ?? '';
            mutationOutputEditorRef.current?.setValue(mutResult);
            setMutateStats({
              responseTimeMs: Math.round(performance.now() - mutStart),
              payloadSizeBytes: new Blob([mutResult]).size,
            });
          } catch (e: unknown) {
            mutationOutputEditorRef.current?.setValue(e instanceof Error ? e.message : 'Unknown error');
          }
          setMutating(false);
          break;
        default:
          break;
      }
    },
    [client, getMutationVariables, mutation, mutationOutputEditorRef, queryOutputEditorRef]
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

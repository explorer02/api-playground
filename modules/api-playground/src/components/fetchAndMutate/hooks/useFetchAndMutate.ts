//lib
import { useCallback, useMemo, useState } from 'react';
import { OnChange, OnMount } from '@monaco-editor/react';

//components
import { VscSend } from 'react-icons/vsc';

//hooks
import { useMonacoMount } from '@/hooks/useMonacoMount';
import { useValidateJSON } from '@/hooks/useValidateJSON';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { FetchAndMutateConfig } from '@/types';
import { FormValues } from '@/components/form/types';
import { Action } from '@/components/snippet/types';

type Params = {
  config: FetchAndMutateConfig;
};

type ReturnType = {
  fetching: boolean;
  mutating: boolean;
  onFetchSubmit: (vals: FormValues) => void;

  onQueryOutputEditorMount: OnMount;
  onMutationOutputEditorMount: OnMount;

  queryActions: Action[];
  onQueryActionClick: (action: string) => void;

  queryResponseErrors: boolean;
  handleQueryResponseChange: OnChange;
};

const EXECUTE_MUTATION = 'EXECUTE_MUTATION';

export const useFetchAndMutate = ({ config }: Params): ReturnType => {
  const [fetching, setFetching] = useState(false);
  const [isQueryExecuted, setIsQueryExecuted] = useState(false);
  const [mutating, setMutating] = useState(false);

  const { errors: queryResponseErrors, handleChange: handleQueryResponseChange } = useValidateJSON();

  const { editorRef: queryOutputEditorRef, onMount: onQueryOutputEditorMount } = useMonacoMount();
  const { editorRef: mutationOutputEditorRef, onMount: onMutationOutputEditorMount } = useMonacoMount();

  const {
    fetchConfig: { getVariables: getQueryVariables, query, cta },
    mutateConfig: { getVariables: getMutationVariables, mutation },
    client,
  } = config;

  const onFetchSubmit = useCallback(
    async (vals: FormValues) => {
      const variables = getQueryVariables(vals);
      setFetching(true);
      try {
        const { data, error } = await client.query({ query, variables, fetchPolicy: 'network-only' });
        queryOutputEditorRef.current?.setValue(prettifyJSON(data) ?? error?.message);
        if (data) {
          setIsQueryExecuted(true);
        }
      } catch (e: any) {
        queryOutputEditorRef.current?.setValue(e?.message);
      }
      setFetching(false);
    },
    [client, getQueryVariables, queryOutputEditorRef, query]
  );

  const onQueryActionClick = useCallback(
    async (action: string) => {
      switch (action) {
        case EXECUTE_MUTATION:
          const mutationVariables = getMutationVariables(JSON.parse(queryOutputEditorRef.current!.getValue()));
          setMutating(true);
          try {
            const { data, errors } = await client.mutate({ mutation, variables: mutationVariables });
            mutationOutputEditorRef.current?.setValue(prettifyJSON(data) ?? errors?.[0]?.message);
          } catch (e: any) {
            mutationOutputEditorRef.current?.setValue(e?.message);
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
    onFetchSubmit,

    onQueryOutputEditorMount,
    onMutationOutputEditorMount,

    queryActions,
    onQueryActionClick,

    queryResponseErrors,
    handleQueryResponseChange,
  };
};

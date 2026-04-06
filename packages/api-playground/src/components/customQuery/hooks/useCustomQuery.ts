//lib
import { useCallback } from 'react';
import { OnMount } from '@monaco-editor/react';

//hooks
import { useMonacoMount } from '~/hooks/useMonacoMount';
import { useGraphQLExecution } from '~/hooks/useGraphQLExecution';

//types
import { CustomQueryConfig } from '~/types';
import { FormValues } from '~/components/form/types';
import { ExecutionStatsData } from '~/components/executionStats/types';

type Params = {
  config: CustomQueryConfig;
};

type ReturnType = {
  loading: boolean;
  stats: ExecutionStatsData | null;
  onSubmit: (vals: FormValues) => void;
  onOutputEditorMount: OnMount;
};

export const useCustomQuery = ({ config }: Params): ReturnType => {
  const { editorRef: outputEditorRef, onMount: onOutputEditorMount } = useMonacoMount();

  const { getVariables, query, client } = config;

  const executeFn = useCallback(
    async (variables: any) => {
      const { data, error } = await client.query({ query, variables, fetchPolicy: 'network-only' });
      return { data, errorMessage: error?.message };
    },
    [client, query]
  );

  const { loading, stats, execute } = useGraphQLExecution({ executeFn, outputEditorRef });

  const onSubmit = useCallback(
    (vals: FormValues) => {
      execute(getVariables(vals));
    },
    [execute, getVariables]
  );

  return { loading, stats, onSubmit, onOutputEditorMount };
};

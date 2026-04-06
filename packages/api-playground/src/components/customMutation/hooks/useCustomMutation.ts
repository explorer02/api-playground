//lib
import { useCallback } from 'react';
import { OnMount } from '@monaco-editor/react';

//hooks
import { useMonacoMount } from '~/hooks/useMonacoMount';
import { useGraphQLExecution } from '~/hooks/useGraphQLExecution';

//types
import { CustomMutationConfig } from '~/types';
import { FormValues } from '~/components/form/types';
import { ExecutionStatsData } from '~/components/executionStats/types';

type Params = {
  config: CustomMutationConfig;
};

type ReturnType = {
  loading: boolean;
  stats: ExecutionStatsData | null;
  onSubmit: (vals: FormValues) => void;
  onOutputEditorMount: OnMount;
};

export const useCustomMutation = ({ config }: Params): ReturnType => {
  const { editorRef: outputEditorRef, onMount: onOutputEditorMount } = useMonacoMount();

  const { getVariables, mutation, client } = config;

  const executeFn = useCallback(
    async (variables: any) => {
      const { data, errors } = await client.mutate({ mutation, variables });
      return { data, errorMessage: errors?.[0]?.message };
    },
    [client, mutation]
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

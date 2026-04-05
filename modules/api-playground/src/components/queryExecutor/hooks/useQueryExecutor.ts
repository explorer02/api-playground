//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import { OnMount } from '@monaco-editor/react';
import { parse } from 'graphql';

//hooks
import { useMonacoMount } from '@/hooks/useMonacoMount';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { QueryExecutorConfig } from '@/types';
import { OnQuerySelect } from '../types';
import { ExecutionStatsData } from '@/components/executionStats/types';

type ExecutionResult = {
  queryText: string;
  variables: string;
  result: string;
  responseTimeMs: number;
};

type Params = {
  config: QueryExecutorConfig;
  onExecutionComplete?: (data: ExecutionResult) => void;
};

type ReturnType = {
  onQuerySelect: OnQuerySelect;

  onInputMount: OnMount;
  onVariableMount: OnMount;
  onOutputMount: OnMount;

  onSubmit: () => void;

  loading: boolean;
  stats: ExecutionStatsData | null;
};

export const useQueryExecutor = ({ config, onExecutionComplete }: Params): ReturnType => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ExecutionStatsData | null>(null);

  const { client } = config;

  const { editorRef: inputEditorRef, onMount: onInputMount } = useMonacoMount();
  const { editorRef: variableEditorRef, onMount: onVariableMount } = useMonacoMount();
  const { editorRef: outputEditorRef, onMount: onOutputMount } = useMonacoMount();

  const onSubmit = useCallback(async () => {
    const queryText = inputEditorRef.current?.getValue() ?? '';
    const variablesText = variableEditorRef.current?.getValue() ?? '';
    const query = parse(queryText);
    const variables = JSON.parse(variablesText);

    setLoading(true);
    setStats(null);
    const startTime = performance.now();
    try {
      const response = await client.query({ query, variables, fetchPolicy: 'network-only' });
      const result = prettifyJSON(response.data) ?? response.error?.message ?? '';
      const elapsed = Math.round(performance.now() - startTime);
      outputEditorRef.current?.setValue(result);
      setStats({ responseTimeMs: elapsed, payloadSizeBytes: new Blob([result]).size });
      onExecutionComplete?.({ queryText, variables: variablesText, result, responseTimeMs: elapsed });
    } catch (e: unknown) {
      outputEditorRef.current?.setValue(e instanceof Error ? e.message : 'Unknown error');
    }
    setLoading(false);
  }, [client, inputEditorRef, outputEditorRef, variableEditorRef, onExecutionComplete]);

  const onQuerySelect = useCallback<OnQuerySelect>(
    ({ query, output, variables }) => {
      inputEditorRef.current?.setValue(query);
      variableEditorRef.current?.setValue(variables ?? '');
      outputEditorRef.current?.setValue(output ?? '');
    },
    [inputEditorRef, outputEditorRef, variableEditorRef]
  );

  return {
    onInputMount,
    onVariableMount,
    onOutputMount,

    onSubmit,
    onQuerySelect,

    loading,
    stats,
  };
};

//lib
import { useCallback, useState } from 'react';
import { OnMount } from '@monaco-editor/react';
import { parse } from 'graphql';

//hooks
import { useMonacoMount } from '~/hooks/useMonacoMount';

//context
import { useTabState, QueryExecutorTabState } from '~/context/TabStateContext';

//utils
import { prettifyJSON } from '~/utils/prettifyJSON';

//types
import { QueryExecutorConfig } from '~/types';
import { OnQuerySelect } from '../types';
import { ExecutionStatsData } from '~/components/executionStats/types';

type ExecutionResult = {
  queryText: string;
  variables: string;
  result: string;
  responseTimeMs: number;
};

type Params = {
  config: QueryExecutorConfig;
  tabId: string;
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

export const useQueryExecutor = ({ config, tabId, onExecutionComplete }: Params): ReturnType => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ExecutionStatsData | null>(null);
  const { getState, setState } = useTabState();

  const { client } = config;

  const { editorRef: inputEditorRef, onMount: rawInputMount } = useMonacoMount();
  const { editorRef: variableEditorRef, onMount: rawVariableMount } = useMonacoMount();
  const { editorRef: outputEditorRef, onMount: rawOutputMount } = useMonacoMount();

  const saveField = useCallback(
    (field: keyof Pick<QueryExecutorTabState, 'input' | 'variables' | 'output'>, value: string) => {
      const current = getState<QueryExecutorTabState>(tabId);
      setState<QueryExecutorTabState>(tabId, {
        type: 'QUERY_EXECUTOR',
        input: '',
        variables: '',
        output: '',
        stats: null,
        ...current,
        [field]: value,
      });
    },
    [tabId, getState, setState]
  );

  // Restore saved tab state on editor mount + save live on changes
  const onInputMount = useCallback<OnMount>(
    (editor, monaco) => {
      rawInputMount(editor, monaco);
      const saved = getState<QueryExecutorTabState>(tabId);
      if (saved?.input) editor.setValue(saved.input);
      editor.onDidChangeModelContent(() => saveField('input', editor.getValue()));
    },
    [rawInputMount, getState, tabId, saveField]
  );

  const onVariableMount = useCallback<OnMount>(
    (editor, monaco) => {
      rawVariableMount(editor, monaco);
      const saved = getState<QueryExecutorTabState>(tabId);
      if (saved?.variables) editor.setValue(saved.variables);
      editor.onDidChangeModelContent(() => saveField('variables', editor.getValue()));
    },
    [rawVariableMount, getState, tabId, saveField]
  );

  const onOutputMount = useCallback<OnMount>(
    (editor, monaco) => {
      rawOutputMount(editor, monaco);
      const saved = getState<QueryExecutorTabState>(tabId);
      if (saved) {
        if (saved.output) editor.setValue(saved.output);
        if (saved.stats) setStats(saved.stats);
      }
      editor.onDidChangeModelContent(() => saveField('output', editor.getValue()));
    },
    [rawOutputMount, getState, tabId, saveField]
  );

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
      const newStats = { responseTimeMs: elapsed, payloadSizeBytes: new Blob([result]).size };
      setStats(newStats);
      const current = getState<QueryExecutorTabState>(tabId);
      setState<QueryExecutorTabState>(tabId, { ...current!, stats: newStats });
      onExecutionComplete?.({ queryText, variables: variablesText, result, responseTimeMs: elapsed });
    } catch (e: unknown) {
      outputEditorRef.current?.setValue(e instanceof Error ? e.message : 'Unknown error');
    }
    setLoading(false);
  }, [client, inputEditorRef, outputEditorRef, variableEditorRef, onExecutionComplete, getState, setState, tabId]);

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

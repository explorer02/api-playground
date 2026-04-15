//lib
import { useCallback } from 'react';
import { OnMount } from '@monaco-editor/react';
import { parse } from 'graphql';
import { ApolloClient } from '@apollo/client';
import { MonacoEditorType } from '~/monaco';

//hooks
import { useMonacoMount } from '~/hooks/useMonacoMount';
import { useGraphQLExecution } from '~/hooks/useGraphQLExecution';

//context
import { useTabState, QueryExecutorTabState, MutationExecutorTabState } from '~/context/TabStateContext';

//constants
import { Template } from '~/constants/template';

//types
import { ExecutionStatsData } from '~/components/executionStats/types';

type EditorTabState = QueryExecutorTabState | MutationExecutorTabState;

type ExecutionResult = {
  queryText: string;
  variables: string;
  result: string;
  responseTimeMs: number;
};

type Params = {
  tabStateType: Template.QUERY_EXECUTOR | Template.MUTATION_EXECUTOR;
  client: ApolloClient<unknown>;
  tabId: string;
  onExecutionComplete?: (data: ExecutionResult) => void;
};

type ReturnType = {
  onInputMount: OnMount;
  onVariableMount: OnMount;
  onOutputMount: OnMount;

  onSubmit: () => void;
  onSelect: (params: { input: string; variables?: string; output?: string }) => void;

  loading: boolean;
  stats: ExecutionStatsData | null;

  inputEditorRef: React.MutableRefObject<MonacoEditorType | undefined>;
  variableEditorRef: React.MutableRefObject<MonacoEditorType | undefined>;
};

export const useGraphQLExecutor = ({ tabStateType, client, tabId, onExecutionComplete }: Params): ReturnType => {
  const { getState, setState } = useTabState();

  const { editorRef: inputEditorRef, onMount: rawInputMount } = useMonacoMount();
  const { editorRef: variableEditorRef, onMount: rawVariableMount } = useMonacoMount();
  const { editorRef: outputEditorRef, onMount: rawOutputMount } = useMonacoMount();

  const executeFn = useCallback(
    async (variables: any) => {
      const document = parse(inputEditorRef.current?.getValue() ?? '');
      if (tabStateType === Template.MUTATION_EXECUTOR) {
        const response = await client.mutate({ mutation: document, variables });
        return { data: response.data, errorMessage: response.errors?.[0]?.message };
      }
      const response = await client.query({ query: document, variables, fetchPolicy: 'network-only' });
      return { data: response.data, errorMessage: response.error?.message };
    },
    [client, inputEditorRef, tabStateType]
  );

  const { loading, stats, execute, setStats } = useGraphQLExecution({ executeFn, outputEditorRef });

  const saveField = useCallback(
    (field: keyof Pick<EditorTabState, 'input' | 'variables' | 'output'>, value: string) => {
      const current = getState<EditorTabState>(tabId);
      setState<EditorTabState>(tabId, {
        type: tabStateType,
        input: '',
        variables: '',
        output: '',
        stats: null,
        ...current,
        [field]: value,
      });
    },
    [tabId, tabStateType, getState, setState]
  );

  const onInputMount = useCallback<OnMount>(
    (editor, monaco) => {
      rawInputMount(editor, monaco);
      const saved = getState<EditorTabState>(tabId);
      if (saved?.input) editor.setValue(saved.input);
      editor.onDidChangeModelContent(() => saveField('input', editor.getValue()));
    },
    [rawInputMount, getState, tabId, saveField]
  );

  const onVariableMount = useCallback<OnMount>(
    (editor, monaco) => {
      rawVariableMount(editor, monaco);
      const saved = getState<EditorTabState>(tabId);
      if (saved?.variables) editor.setValue(saved.variables);
      editor.onDidChangeModelContent(() => saveField('variables', editor.getValue()));
    },
    [rawVariableMount, getState, tabId, saveField]
  );

  const onOutputMount = useCallback<OnMount>(
    (editor, monaco) => {
      rawOutputMount(editor, monaco);
      const saved = getState<EditorTabState>(tabId);
      if (saved) {
        if (saved.output) editor.setValue(saved.output);
        if (saved.stats) setStats(saved.stats);
      }
      editor.onDidChangeModelContent(() => saveField('output', editor.getValue()));
    },
    [rawOutputMount, getState, tabId, saveField, setStats]
  );

  const onSubmit = useCallback(async () => {
    const queryText = inputEditorRef.current?.getValue() ?? '';
    const variablesText = variableEditorRef.current?.getValue() ?? '';
    const variables = JSON.parse(variablesText);

    const result = await execute(variables);
    if (result) {
      const current = getState<EditorTabState>(tabId);
      setState<EditorTabState>(tabId, {
        ...current!,
        stats: { responseTimeMs: result.elapsed, payloadSizeBytes: new Blob([result.result]).size },
      });
      onExecutionComplete?.({
        queryText,
        variables: variablesText,
        result: result.result,
        responseTimeMs: result.elapsed,
      });
    }
  }, [inputEditorRef, variableEditorRef, execute, getState, setState, tabId, onExecutionComplete]);

  const onSelect = useCallback(
    ({ input, variables, output }: { input: string; variables?: string; output?: string }) => {
      inputEditorRef.current?.setValue(input);
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
    onSelect,
    loading,
    stats,
    inputEditorRef,
    variableEditorRef,
  };
};

//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { OnMount } from '@monaco-editor/react';
import { parse } from 'graphql';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { QueryExecutorConfig } from '@/types';
import { OnQuerySelect } from '../types';

type Params = {
  config: QueryExecutorConfig;
};

type ReturnType = {
  onQuerySelect: OnQuerySelect;

  onInputMount: OnMount;
  onVariableMount: OnMount;
  onOutputMount: OnMount;

  onSubmit: () => void;

  loading: boolean;
};

const useMount = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMount = useCallback<OnMount>(mEditor => {
    editorRef.current = mEditor;
  }, []);

  return { editorRef, onMount };
};

export const useQueryExecutor = ({ config }: Params): ReturnType => {
  const [loading, setLoading] = useState(false);

  const { client } = config;

  const { editorRef: inputEditorRef, onMount: onInputMount } = useMount();
  const { editorRef: variableEditorRef, onMount: onVariableMount } = useMount();
  const { editorRef: outputEditorRef, onMount: onOutputMount } = useMount();

  const onSubmit = useCallback(async () => {
    const query = parse(inputEditorRef.current?.getValue() ?? '');
    const variables = JSON.parse(variableEditorRef.current?.getValue() ?? '');

    setLoading(true);
    const response = await client.query({ query, variables, fetchPolicy: 'network-only' });
    setLoading(false);
    outputEditorRef.current?.setValue(prettifyJSON(response.data) ?? response.error?.message);
  }, [client, inputEditorRef, outputEditorRef, variableEditorRef]);

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
  };
};

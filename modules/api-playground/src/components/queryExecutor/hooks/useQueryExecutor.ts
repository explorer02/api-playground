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

export const useQueryExecutor = ({ config }: Params): ReturnType => {
  const [loading, setLoading] = useState(false);

  const { client } = config;

  const { editorRef: inputEditorRef, onMount: onInputMount } = useMonacoMount();
  const { editorRef: variableEditorRef, onMount: onVariableMount } = useMonacoMount();
  const { editorRef: outputEditorRef, onMount: onOutputMount } = useMonacoMount();

  const onSubmit = useCallback(async () => {
    const query = parse(inputEditorRef.current?.getValue() ?? '');
    const variables = JSON.parse(variableEditorRef.current?.getValue() ?? '');

    setLoading(true);
    try {
      const response = await client.query({ query, variables, fetchPolicy: 'network-only' });
      outputEditorRef.current?.setValue(prettifyJSON(response.data) ?? response.error?.message);
    } catch (e: any) {
      outputEditorRef.current?.setValue(e.message);
    }
    setLoading(false);
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

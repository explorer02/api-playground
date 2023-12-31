//lib
import { useCallback, useRef, useState } from 'react';
import { OnMount } from '@monaco-editor/react';
import { parse } from 'graphql';

//hooks
import { useMonacoMount } from '@/hooks/useMonacoMount';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { MutationExecutorConfig } from '@/types';
import { OnMutationSelect } from '../types';

type Params = {
  config: MutationExecutorConfig;
};

type ReturnType = {
  onInputMount: OnMount;
  onVariableMount: OnMount;
  onOutputMount: OnMount;

  onSubmit: () => void;

  loading: boolean;

  onMutationSelect: OnMutationSelect;
};

export const useMutationExecutor = ({ config }: Params): ReturnType => {
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

  const onMutationSelect = useCallback<OnMutationSelect>(
    ({ mutation, output, variables }) => {
      inputEditorRef.current?.setValue(mutation);
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

    loading,

    onMutationSelect,
  };
};

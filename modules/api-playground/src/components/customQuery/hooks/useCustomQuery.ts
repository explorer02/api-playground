//lib
import { useCallback, useState } from 'react';
import { OnMount } from '@monaco-editor/react';

//hooks
import { useMonacoMount } from '@/hooks/useMonacoMount';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { CustomQueryConfig } from '@/types';
import { FormValues } from '@/components/form/types';

type Params = {
  config: CustomQueryConfig;
};

type ReturnType = {
  loading: boolean;
  onSubmit: (vals: FormValues) => void;
  onOutputEditorMount: OnMount;
};

export const useCustomQuery = ({ config }: Params): ReturnType => {
  const [loading, setLoading] = useState(false);

  const { editorRef: outputEditorRef, onMount: onOutputEditorMount } = useMonacoMount();

  const { getVariables, query, client } = config;

  const onSubmit = useCallback(
    async (vals: FormValues) => {
      const variables = getVariables(vals);
      setLoading(true);
      try {
        const { data, error } = await client.query({ query, variables, fetchPolicy: 'network-only' });
        outputEditorRef.current?.setValue(prettifyJSON(data) ?? error?.message);
      } catch (e: unknown) {
        outputEditorRef.current?.setValue(e instanceof Error ? e.message : 'Unknown error');
      }
      setLoading(false);
    },
    [client, getVariables, outputEditorRef, query]
  );

  return { loading, onSubmit, onOutputEditorMount };
};

//lib
import { useCallback, useState } from 'react';
import { OnMount } from '@monaco-editor/react';

//hooks
import { useMonacoMount } from '@/hooks/useMonacoMount';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { CustomMutationConfig } from '@/types';
import { FormValues } from '@/components/form/types';

type Params = {
  config: CustomMutationConfig;
};

type ReturnType = {
  loading: boolean;
  onSubmit: (vals: FormValues) => void;
  onOutputEditorMount: OnMount;
};

export const useCustomMutation = ({ config }: Params): ReturnType => {
  const [loading, setLoading] = useState(false);

  const { editorRef: outputEditorRef, onMount: onOutputEditorMount } = useMonacoMount();

  const { getVariables, mutation, client } = config;

  const onSubmit = useCallback(
    async (vals: FormValues) => {
      const variables = getVariables(vals);
      setLoading(true);
      try {
        const { data, errors } = await client.mutate({ mutation, variables });
        outputEditorRef.current?.setValue(prettifyJSON(data) ?? errors?.[0]?.message);
      } catch (e: any) {
        outputEditorRef.current?.setValue(e?.message);
      }
      setLoading(false);
    },
    [client, getVariables, mutation, outputEditorRef]
  );

  return { loading, onSubmit, onOutputEditorMount };
};

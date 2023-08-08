//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { OnMount } from '@monaco-editor/react';

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

  const outputEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const { getQueryVariables, query, client } = config;

  const onOutputEditorMount = useCallback<OnMount>(editor => {
    outputEditorRef.current = editor;
  }, []);

  const onSubmit = useCallback(
    async (vals: FormValues) => {
      const variables = getQueryVariables(vals);
      setLoading(true);
      try {
        const { data, error } = await client.query({ query, variables, fetchPolicy: 'network-only' });
        outputEditorRef.current?.setValue(prettifyJSON(data) ?? error?.message);
      } catch (e: any) {
        outputEditorRef.current?.setValue(e?.message);
      }
      setLoading(false);
    },
    [client, getQueryVariables, query]
  );

  return { loading, onSubmit, onOutputEditorMount };
};

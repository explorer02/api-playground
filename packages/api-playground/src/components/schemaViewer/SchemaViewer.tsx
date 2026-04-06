// lib
import { useCallback, useEffect, useMemo, useState } from 'react';

// components
import { Snippet } from '~/components/snippet';

// hooks
import { useMonacoMount } from '~/hooks/useMonacoMount';

// utils
import { prettifyJSON } from '~/utils/prettifyJSON';

// constants
import { INTROSPECTION_QUERY } from './query';

// types
import { SchemaViewerConfig } from '~/types';

export const SchemaViewer = ({ config }: { config: SchemaViewerConfig }): JSX.Element => {
  const [loading, setLoading] = useState(true);

  const { editorRef, onMount } = useMonacoMount();

  const fetchSchema = useCallback(async () => {
    setLoading(true);
    try {
      const result = await config.client.query({ query: INTROSPECTION_QUERY });
      const formatted = prettifyJSON(result.data);
      editorRef.current?.setValue(formatted);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to fetch schema';
      editorRef.current?.setValue(errMsg);
    } finally {
      setLoading(false);
    }
  }, [config.client, editorRef]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  const editorProps = useMemo(() => ({ onMount, readOnly: true }), [onMount]);

  return <Snippet title="Schema" editorProps={editorProps} loading={loading} />;
};

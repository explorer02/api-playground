//lib
import { MutableRefObject, useCallback, useState } from 'react';

//utils
import { prettifyJSON } from '~/utils/prettifyJSON';

//types
import { MonacoEditorType } from '~/monaco';
import { ExecutionStatsData } from '~/components/executionStats/types';

type ExecuteFn = (variables: any) => Promise<{ data: any; errorMessage?: string }>;

type Params = {
  executeFn: ExecuteFn;
  outputEditorRef: MutableRefObject<MonacoEditorType | undefined>;
};

type ReturnType = {
  loading: boolean;
  stats: ExecutionStatsData | null;
  execute: (variables: any) => Promise<{ result: string; elapsed: number } | void>;
  setStats: (stats: ExecutionStatsData | null) => void;
};

export const useGraphQLExecution = ({ executeFn, outputEditorRef }: Params): ReturnType => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ExecutionStatsData | null>(null);

  const execute = useCallback(
    async (variables: any) => {
      setLoading(true);
      setStats(null);
      const startTime = performance.now();
      try {
        const { data, errorMessage } = await executeFn(variables);
        const result = prettifyJSON(data) ?? errorMessage ?? '';
        const elapsed = Math.round(performance.now() - startTime);
        outputEditorRef.current?.setValue(result);
        setStats({ responseTimeMs: elapsed, payloadSizeBytes: new Blob([result]).size });
        return { result, elapsed };
      } catch (e: unknown) {
        outputEditorRef.current?.setValue(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [executeFn, outputEditorRef]
  );

  return { loading, stats, execute, setStats };
};

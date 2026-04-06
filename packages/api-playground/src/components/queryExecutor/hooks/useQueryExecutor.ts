//lib
import { useCallback } from 'react';
import { OnMount } from '@monaco-editor/react';

//hooks
import { useGraphQLExecutor } from '~/hooks/useGraphQLExecutor';

//constants
import { Template } from '~/constants/template';

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
  const { onSelect, onInputMount, onVariableMount, onOutputMount, onSubmit, loading, stats } = useGraphQLExecutor({
    tabStateType: Template.QUERY_EXECUTOR,
    client: config.client,
    tabId,
    onExecutionComplete,
  });

  const onQuerySelect = useCallback<OnQuerySelect>(
    ({ query, variables, output }) => onSelect({ input: query, variables, output }),
    [onSelect]
  );

  return { onInputMount, onVariableMount, onOutputMount, onSubmit, loading, stats, onQuerySelect };
};

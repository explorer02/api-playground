//lib
import { useCallback } from 'react';
import { OnMount } from '@monaco-editor/react';

//hooks
import { useGraphQLExecutor } from '~/hooks/useGraphQLExecutor';

//constants
import { Template } from '~/constants/template';

//types
import { MutationExecutorConfig } from '~/types';
import { OnMutationSelect } from '../types';
import { ExecutionStatsData } from '~/components/executionStats/types';
import { MonacoEditorType } from '~/monaco';

type ExecutionResult = {
  queryText: string;
  variables: string;
  result: string;
  responseTimeMs: number;
};

type Params = {
  config: MutationExecutorConfig;
  tabId: string;
  onExecutionComplete?: (data: ExecutionResult) => void;
};

type ReturnType = {
  onInputMount: OnMount;
  onVariableMount: OnMount;
  onOutputMount: OnMount;
  onSubmit: () => void;
  loading: boolean;
  stats: ExecutionStatsData | null;
  onMutationSelect: OnMutationSelect;
  inputEditorRef: React.MutableRefObject<MonacoEditorType | undefined>;
  variableEditorRef: React.MutableRefObject<MonacoEditorType | undefined>;
};

export const useMutationExecutor = ({ config, tabId, onExecutionComplete }: Params): ReturnType => {
  const {
    onSelect,
    onInputMount,
    onVariableMount,
    onOutputMount,
    onSubmit,
    loading,
    stats,
    inputEditorRef,
    variableEditorRef,
  } = useGraphQLExecutor({
    tabStateType: Template.MUTATION_EXECUTOR,
    client: config.client,
    tabId,
    onExecutionComplete,
  });

  const onMutationSelect = useCallback<OnMutationSelect>(
    ({ mutation, variables, output }) => onSelect({ input: mutation, variables, output }),
    [onSelect]
  );

  return {
    onInputMount,
    onVariableMount,
    onOutputMount,
    onSubmit,
    loading,
    stats,
    onMutationSelect,
    inputEditorRef,
    variableEditorRef,
  };
};

//lib
import { useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';

//components
import { InputEditor } from '../queryExecutor/components/inputEditor';
import { VariableEditor } from '../queryExecutor/components/variableEditor';
import { OutputEditor } from '../queryExecutor/components/outputEditor';
import { MutationSelector } from './components/mutationSelector';
import { ExecutionStats } from '../executionStats';
import { QueryHistory } from '../queryHistory';
import { VscSend, VscTerminal } from 'react-icons/vsc';
import { Button } from '~/shared/button';

//hooks
import { useMutationExecutor } from './hooks/useMutationExecutor';
import { useHistory } from '~/context/HistoryContext';

//utils
import { generateGraphQLCurl, getApolloUri } from '~/utils/generateCurl';

//constants
import { Template } from '~/constants/template';

//types
import { MutationExecutorConfig } from '~/types';
import { HistoryEntry } from '../queryHistory/types';

const QUERY_CONTAINER_CLASSNAME = 'flex-1 flex-grow-2';
const VARIABLE_CONTAINER_CLASSNAME = 'flex-1';

export const MutationExecutor = ({ config, tabId }: { config: MutationExecutorConfig; tabId: string }) => {
  const { entries, addEntry, clearHistory } = useHistory(Template.MUTATION_EXECUTOR);

  const onExecutionComplete = useCallback(
    (data: { queryText: string; variables: string; result: string; responseTimeMs: number }) => {
      addEntry({ ...data, templateId: config.id, templateType: Template.MUTATION_EXECUTOR });
    },
    [addEntry, config.id]
  );

  const { onInputMount, onOutputMount, onVariableMount, onSubmit, loading, onMutationSelect, stats, inputEditorRef, variableEditorRef } =
    useMutationExecutor({ config, tabId, onExecutionComplete });

  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopyCurl = useCallback(() => {
    const query = inputEditorRef.current?.getValue() ?? '';
    const variables = variableEditorRef.current?.getValue() ?? '';
    const endpoint = getApolloUri(config.client);
    const curl = generateGraphQLCurl({ endpoint, query, variables: variables || undefined });
    copyToClipboard(curl);
  }, [inputEditorRef, variableEditorRef, config.client, copyToClipboard]);

  const onHistorySelect = useCallback(
    (entry: HistoryEntry) => {
      onMutationSelect({ mutation: entry.queryText, variables: entry.variables, output: entry.result });
    },
    [onMutationSelect]
  );

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <div className="flex-none flex gap-3">
          <MutationSelector config={config} onChange={onMutationSelect} className="flex-1" />
          <QueryHistory entries={entries} onSelect={onHistorySelect} onClear={clearHistory} />
          <Button className="flex-none" size="xs" tooltipContent="Copy as cURL" onClick={handleCopyCurl} icon>
            <VscTerminal size={16} />
          </Button>
          <Button className="flex-none" size="xs" tooltipContent="Execute" onClick={onSubmit} icon>
            <VscSend />
          </Button>
        </div>
        <InputEditor
          title={config.config?.input?.title ?? 'Mutation'}
          onSubmit={onSubmit}
          className={QUERY_CONTAINER_CLASSNAME}
          onMount={onInputMount}
        />
        <VariableEditor
          title={config.config?.variable?.title}
          onSubmit={onSubmit}
          className={VARIABLE_CONTAINER_CLASSNAME}
          onMount={onVariableMount}
        />
      </div>
      <div className="flex-1 relative">
        <OutputEditor
          title={config.config?.output?.title}
          readOnly={config.config?.output?.readOnly}
          className="h-full"
          onMount={onOutputMount}
          loading={loading}
        />
        {stats && <ExecutionStats stats={stats} />}
      </div>
    </div>
  );
};

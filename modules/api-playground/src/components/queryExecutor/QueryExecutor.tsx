//lib
import { useCallback } from 'react';

//components
import { InputEditor } from './components/inputEditor';
import { VariableEditor } from './components/variableEditor';
import { OutputEditor } from './components/outputEditor';
import { QuerySelector } from './components/querySelector';
import { ExecutionStats } from '../executionStats';
import { QueryHistory } from '../queryHistory';
import { VscSend, VscSync } from 'react-icons/vsc';
import { Button } from '@/shared/button';

//hooks
import { useQueryExecutor } from './hooks/useQueryExecutor';
import { useHistory } from '@/context/HistoryContext';

//types
import { QueryExecutorConfig } from '@/types';
import { HistoryEntry } from '../queryHistory/types';

const QUERY_CONTAINER_CLASSNAME = 'flex-1 flex-grow-2';
const VARIABLE_CONTAINER_CLASSNAME = 'flex-1';

export const QueryExecutor = ({ config }: { config: QueryExecutorConfig }) => {
  const { entries, addEntry, clearHistory } = useHistory();

  const onExecutionComplete = useCallback(
    (data: { queryText: string; variables: string; result: string; responseTimeMs: number }) => {
      addEntry({ ...data, templateId: config.id });
    },
    [addEntry, config.id]
  );

  const { onInputMount, onOutputMount, onVariableMount, onSubmit, loading, onQuerySelect, stats } = useQueryExecutor({
    config,
    onExecutionComplete,
  });

  const onHistorySelect = useCallback(
    (entry: HistoryEntry) => {
      onQuerySelect({ query: entry.queryText, variables: entry.variables, output: entry.result });
    },
    [onQuerySelect]
  );

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <div className="flex-none flex gap-3">
          <QuerySelector config={config} onChange={onQuerySelect} className="flex-1" />
          <QueryHistory entries={entries} onSelect={onHistorySelect} onClear={clearHistory} />
          <Button tooltipContent="Refresh Queries" className="flex-none" size="xs" variant="secondary" icon>
            <VscSync size={16} strokeWidth={0.4} />
          </Button>
          <Button className="flex-none" size="xs" tooltipContent="Execute" onClick={onSubmit} icon>
            <VscSend />
          </Button>
        </div>
        <InputEditor
          title={config.config?.input?.title}
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

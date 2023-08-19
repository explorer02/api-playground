//components
import { InputEditor } from './components/inputEditor';
import { VariableEditor } from './components/variableEditor';
import { OutputEditor } from './components/outputEditor';
import { QuerySelector } from './components/querySelector';
import { VscSend, VscSync } from 'react-icons/vsc';
import { Button } from '@/spaceweb/button';

//hooks
import { useQueryExecutor } from './hooks/useQueryExecutor';

//types
import { QueryExecutorConfig } from '@/types';

const QUERY_CONTAINER_CLASSNAME = 'flex-1 flex-grow-2';
const VARIABLE_CONTAINER_CLASSNAME = 'flex-1';

export const QueryExecutor = ({ config }: { config: QueryExecutorConfig }) => {
  const { onInputMount, onOutputMount, onVariableMount, onSubmit, loading, onQuerySelect } = useQueryExecutor({
    config,
  });

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <div className="flex-none flex gap-3">
          <QuerySelector config={config} onChange={onQuerySelect} className="flex-1" />
          <Button tooltipContent="Refresh Queries" className="flex-none" size="xs" variant="secondary" icon>
            <VscSync size={16} strokeWidth={0.4} />
          </Button>
          <Button className="min-w-0" size="xs" tooltipContent="Execute" onClick={onSubmit}>
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
      <OutputEditor
        title={config.config?.output?.title}
        readOnly={config.config?.output?.readOnly}
        className="flex-1"
        onMount={onOutputMount}
        loading={loading}
      />
    </div>
  );
};

//components
import { InputEditor } from '../queryExecutor/components/inputEditor';
import { VariableEditor } from '../queryExecutor//components/variableEditor';
import { OutputEditor } from '../queryExecutor/components/outputEditor';
import { MutationSelector } from './components/mutationSelector';
import { VscSend } from 'react-icons/vsc';
import { Button } from '@/spaceweb/button';

//hooks
import { useMutationExecutor } from './hooks/useMutationExecutor';

//types
import { MutationExecutorConfig } from '@/types';

const QUERY_CONTAINER_CLASSNAME = 'flex-1 flex-grow-2';
const VARIABLE_CONTAINER_CLASSNAME = 'flex-1';

export const MutationExecutor = ({ config }: { config: MutationExecutorConfig }) => {
  const { onInputMount, onOutputMount, onVariableMount, onSubmit, loading, onMutationSelect } = useMutationExecutor({
    config,
  });

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <div className="flex-none flex gap-3">
          <MutationSelector config={config} onChange={onMutationSelect} className="flex-1" />
          <Button className="min-w-0" size="xs" tooltipContent="Execute" onClick={onSubmit}>
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

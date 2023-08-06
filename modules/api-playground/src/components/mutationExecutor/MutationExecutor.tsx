//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { InputEditor } from '../queryExecutor/components/inputEditor';
import { VariableEditor } from '../queryExecutor//components/variableEditor';
import { OutputEditor } from '../queryExecutor/components/outputEditor';
import { VscSend } from 'react-icons/vsc';
import { Button } from '@sprinklrjs/spaceweb/button';

//hooks
import { useMutationExecutor } from './hooks/useMutationExecutor';

//types
import { MutationExecutorConfig } from '@/types';
import { ClassName } from '@sprinklrjs/spaceweb';

const QUERY_CONTAINER_CLASSNAME: ClassName = [{ flexGrow: 2, flexBasis: 0, flexShrink: 1 }];
const VARIABLE_CONTAINER_CLASSNAME: ClassName = [{ flexGrow: 1, flexBasis: 0, flexShrink: 1 }];

export const MutationExecutor = ({ config }: { config: MutationExecutorConfig }) => {
  const { onInputMount, onOutputMount, onVariableMount, onSubmit, loading } = useMutationExecutor({
    config,
  });

  return (
    <Box className="h-full flex gap-4">
      <Box className="h-full flex flex-col gap-4 flex-1">
        <Box className="flex-none flex gap-3">
          <Button className="min-w-0" size="xs" tooltipContent="Execute" onClick={onSubmit}>
            <VscSend />
          </Button>
        </Box>
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
      </Box>
      <OutputEditor
        title={config.config?.output?.title}
        readOnly={config.config?.output?.readOnly}
        className="flex-1"
        onMount={onOutputMount}
        loading={loading}
      />
    </Box>
  );
};

//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { InputEditor } from './components/inputEditor';
import { VariableEditor } from './components/variableEditor';
import { OutputEditor } from './components/outputEditor';
import { QuerySelector } from './components/querySelector';
import { VscSend, VscSync } from 'react-icons/vsc';
import { Button, IconButton } from '@sprinklrjs/spaceweb/button';

//hooks
import { useQueryExecutor } from './hooks/useQueryExecutor';

//types
import { QueryExecutorConfig } from '@/types';
import { ClassName } from '@sprinklrjs/spaceweb';

const QUERY_CONTAINER_CLASSNAME: ClassName = [{ flexGrow: 2, flexBasis: 0, flexShrink: 1 }];
const VARIABLE_CONTAINER_CLASSNAME: ClassName = [{ flexGrow: 1, flexBasis: 0, flexShrink: 1 }];

export const QueryExecutor = ({ config }: { config: QueryExecutorConfig }) => {
  const { config: { output } = {} } = config;

  const { onInputMount, onOutputMount, onVariableMount, onSubmit, loading, onQuerySelect } = useQueryExecutor({
    config,
  });

  return (
    <Box className="h-full flex gap-4">
      <Box className="h-full flex flex-col gap-4 flex-1">
        <Box className="flex-none flex gap-3">
          <QuerySelector config={config} onChange={onQuerySelect} className="flex-1" />
          <IconButton tooltipContent="Refresh Queries" className="flex-none" bordered shape="square" size="xs">
            <VscSync size={16} stroke="black" strokeWidth={0.3} />
          </IconButton>
          <Button className="min-w-0" size="xs" tooltipContent="Execute" onClick={onSubmit}>
            <VscSend />
          </Button>
        </Box>
        <InputEditor config={config} onSubmit={onSubmit} className={QUERY_CONTAINER_CLASSNAME} onMount={onInputMount} />
        <VariableEditor
          config={config}
          onSubmit={onSubmit}
          className={VARIABLE_CONTAINER_CLASSNAME}
          onMount={onVariableMount}
        />
      </Box>
      <OutputEditor config={config} className="flex-1" onMount={onOutputMount} loading={loading} />
    </Box>
  );
};

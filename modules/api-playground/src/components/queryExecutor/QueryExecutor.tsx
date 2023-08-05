//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { Snippet } from '../snippet';
import { Select } from '@sprinklrjs/spaceweb/select';
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
  const { config: { input, variable, output } = {} } = config;

  const { queryOptions, selectedQueryOption, onOptionSelect, onInputMount, onOutputMount, onVariableMount, onSubmit } =
    useQueryExecutor({
      config,
    });

  return (
    <Box className="h-full flex gap-4">
      <Box className="h-full flex flex-col gap-4 flex-1">
        <Box className="flex-none flex gap-3">
          <Select
            options={queryOptions}
            value={selectedQueryOption}
            placeholder="Select Executed Queries"
            className="flex-1"
            size="xs"
            onChange={onOptionSelect}
          />
          <IconButton tooltipContent="Refresh Queries" className="flex-none" bordered shape="square" size="xs">
            <VscSync size={16} stroke="black" strokeWidth={0.3} />
          </IconButton>
          <Button className="min-w-0" size="xs" tooltipContent="Execute" onClick={onSubmit}>
            <VscSend />
          </Button>
        </Box>
        <Snippet
          title={input?.title ?? 'Query'}
          content=""
          className={QUERY_CONTAINER_CLASSNAME}
          onMount={onInputMount}
          language="graqhql"
        />
        <Snippet
          title={variable?.title ?? 'Variables'}
          content=""
          className={VARIABLE_CONTAINER_CLASSNAME}
          onMount={onVariableMount}
        />
      </Box>
      <Snippet
        title={output?.title ?? 'Output'}
        content=""
        className="flex-1"
        readOnly={output?.readOnly}
        onMount={onOutputMount}
      />
    </Box>
  );
};

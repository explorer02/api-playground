//lib
import { memo } from 'react';
import { DocumentNode } from 'graphql';

//components
import { Select } from '@sprinklrjs/spaceweb/select';

//hooks
import { useQuerySelector } from './hooks/useQuerySelector';

//types
import { QueryExecutorConfig } from '@/types';
import { ClassName } from '@sprinklrjs/spaceweb';
import { OnQuerySelect } from '../../types';

type Props = {
  config: QueryExecutorConfig;
  onChange: OnQuerySelect;
  className?: ClassName;
};

const QuerySelector = ({ config, onChange, className }: Props) => {
  const { options, selectedOption, onOptionSelect } = useQuerySelector({ config, onChange });

  return (
    <Select
      options={options}
      value={selectedOption}
      placeholder="Select Query..."
      className={className}
      size="xs"
      onChange={onOptionSelect}
    />
  );
};

const MemoizedQuerySelector = memo(QuerySelector);

export { MemoizedQuerySelector as QuerySelector };

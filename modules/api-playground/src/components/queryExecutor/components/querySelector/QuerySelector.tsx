//lib
import { memo } from 'react';

//components
import { Select } from '@/spaceweb/select';

//hooks
import { useQuerySelector } from './hooks/useQuerySelector';

//types
import { QueryExecutorConfig } from '@/types';
import { OnQuerySelect } from '../../types';

type Props = {
  config: QueryExecutorConfig;
  onChange: OnQuerySelect;
  className?: string;
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

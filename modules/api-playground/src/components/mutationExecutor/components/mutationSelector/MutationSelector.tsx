//lib
import { memo } from 'react';

//components
import { Select } from '@sprinklrjs/spaceweb/select';

//hooks
import { useMutationSelector } from './hooks/useMutationSelector';

//types
import { MutationExecutorConfig } from '@/types';
import { ClassName } from '@sprinklrjs/spaceweb';
import { OnMutationSelect } from '../../types';

type Props = {
  config: MutationExecutorConfig;
  onChange: OnMutationSelect;
  className?: ClassName;
};

const MutationSelector = ({ config, onChange, className }: Props) => {
  const { selectedOption, onOptionSelect } = useMutationSelector({ onChange });

  return (
    <Select
      options={config.mutations ?? []}
      value={selectedOption}
      placeholder="Select Mutation..."
      className={className}
      size="xs"
      onChange={onOptionSelect}
    />
  );
};

const MemoizedMutationSelector = memo(MutationSelector);

export { MemoizedMutationSelector as MutationSelector };

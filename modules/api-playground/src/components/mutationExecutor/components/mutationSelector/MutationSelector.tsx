//lib
import { memo } from 'react';

//components
import { Select } from '@/shared/select';

//hooks
import { useMutationSelector } from './hooks/useMutationSelector';

//types
import { MutationExecutorConfig } from '@/types';
import { OnMutationSelect } from '../../types';

type Props = {
  config: MutationExecutorConfig;
  onChange: OnMutationSelect;
  className?: string;
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

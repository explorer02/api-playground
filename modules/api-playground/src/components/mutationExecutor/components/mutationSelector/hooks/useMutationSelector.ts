//lib
import { useCallback, useState } from 'react';
import { DocumentNode, print } from 'graphql';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { Option } from '@/spaceweb/select';
import { OnMutationSelect } from '@/components/mutationExecutor/types';

type Params = {
  onChange: OnMutationSelect;
};

type ReturnType = {
  selectedOption: Option | undefined;
  onOptionSelect: (option: Option) => void;
};

export const useMutationSelector = ({ onChange }: Params): ReturnType => {
  const [selectedOption, setSelectedOption] = useState<Option>();

  const onOptionSelect = useCallback(
    async (option: Option) => {
      setSelectedOption(option);
      const { node, variables = {} } = option as Option & { node: DocumentNode; variables?: object };
      onChange({
        mutation: print(node),
        variables: prettifyJSON(variables),
      });
    },
    [onChange]
  );

  return {
    selectedOption,
    onOptionSelect,
  };
};

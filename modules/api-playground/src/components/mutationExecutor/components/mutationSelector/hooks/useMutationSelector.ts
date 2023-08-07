//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import { DocumentNode, print } from 'graphql';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { OnChangeParams, Option } from '@sprinklrjs/spaceweb/select';
import { OnMutationSelect } from '@/components/mutationExecutor/types';

type Params = {
  onChange: OnMutationSelect;
};

type ReturnType = {
  selectedOption: Option[] | undefined;
  onOptionSelect: (param: OnChangeParams) => void;
};

export const useMutationSelector = ({ onChange }: Params): ReturnType => {
  const [selectedOption, setSelectedOption] = useState<Option[]>();

  const onOptionSelect = useCallback(
    async ({ value }: OnChangeParams) => {
      setSelectedOption(value as Option[]);
      if (value.length) {
        const { node, variables = {} } = value[0] as { node: DocumentNode; variables?: object };
        onChange({
          mutation: print(node),
          variables: prettifyJSON(variables),
        });
      }
    },
    [onChange]
  );

  return {
    selectedOption,
    onOptionSelect,
  };
};

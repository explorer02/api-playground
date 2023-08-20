//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import { QueryInfo } from '@apollo/client/core/QueryInfo';
import { DocumentNode, Kind, OperationDefinitionNode, parse, print } from 'graphql';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { QueryExecutorConfig } from '@/types';
import { Option } from '@/spaceweb/select';
import { OnQuerySelect } from '@/components/queryExecutor/types';

type Params = {
  config: QueryExecutorConfig;
  onChange: OnQuerySelect;
};

type ReturnType = {
  options: Option[];
  selectedOption: Option | undefined;
  onOptionSelect: (option: Option) => void;
};

export const useQuerySelector = ({ config, onChange }: Params): ReturnType => {
  const { client } = config;

  const [selectedOption, setSelectedOption] = useState<Option>();

  const options = useMemo<Option[]>(() => {
    // @ts-ignore not anymore
    const queriesMap = client.queryManager.queries as Map<string, QueryInfo>;

    const queriesArray = Array.from(queriesMap.values());

    return queriesArray.map<Option>(query => {
      const name =
        (
          query.document?.definitions.find(def => def.kind === Kind.OPERATION_DEFINITION) as
            | OperationDefinitionNode
            | undefined
        )?.name?.value ?? '';
      const variables = query.variables ?? {};
      const node = query.document;

      return { id: query.queryId, label: `${name}(${JSON.stringify(variables)})`, node, variables: query.variables };
    });
  }, [client]);

  const onOptionSelect = useCallback(
    async (option: Option) => {
      setSelectedOption(option);
      const { node, variables = {} } = option as Option & { node: DocumentNode; variables?: Record<string, any> };

      if (node) {
        try {
          const output = await client.query({ query: node, variables, fetchPolicy: 'cache-only' });
          onChange({
            query: print(node),
            variables: prettifyJSON(variables),
            output: prettifyJSON(output.data) || output.error?.message,
          });
        } catch (e: any) {
          onChange({
            query: print(node),
            variables: prettifyJSON(variables),
            output: e.message,
          });
        }
      }
    },
    [client, onChange]
  );

  return {
    selectedOption,
    options,
    onOptionSelect,
  };
};

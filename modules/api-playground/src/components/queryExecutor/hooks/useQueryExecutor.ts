//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { QueryInfo } from '@apollo/client/core/QueryInfo';
import { DocumentNode, Kind, OperationDefinitionNode, parse, print } from 'graphql';

//types
import { QueryExecutorConfig } from '@/types';
import { OnChangeParams, Option } from '@sprinklrjs/spaceweb/select';

type Params = {
  config: QueryExecutorConfig;
};

type ReturnType = {
  queryOptions: Option[];
  selectedQueryOption: Option[] | undefined;
  onOptionSelect: (param: OnChangeParams) => void;

  onInputMount: (mEditor: monaco.editor.IStandaloneCodeEditor) => void;
  onVariableMount: (mEditor: monaco.editor.IStandaloneCodeEditor) => void;
  onOutputMount: (mEditor: monaco.editor.IStandaloneCodeEditor) => void;

  onSubmit: () => void;
};

const useMount = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMount = useCallback((mEditor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = mEditor;
    editorRef.current.onKeyDown(e => {
      // console.log(e.metaKey, e);
    });
  }, []);

  return { editorRef, onMount };
};

export const useQueryExecutor = ({ config }: Params): ReturnType => {
  const { client } = config;

  const [selectedOption, setSelectedOption] = useState<Option[]>();

  const { editorRef: inputEditorRef, onMount: onInputMount } = useMount();
  const { editorRef: variableEditorRef, onMount: onVariableMount } = useMount();
  const { editorRef: outputEditorRef, onMount: onOutputMount } = useMount();

  const queryOptions = useMemo<Option[]>(() => {
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
    async ({ value }: OnChangeParams) => {
      setSelectedOption(value as Option[]);
      if (value.length) {
        const { node, variables = {} } = value[0] as { node: DocumentNode; variables?: Record<string, any> };

        variableEditorRef.current?.setValue(JSON.stringify(variables, null, 4));

        if (node) {
          inputEditorRef.current?.setValue(print(node));
          try {
            const output = await client.query({ query: {} as any, variables, fetchPolicy: 'cache-only' });
            outputEditorRef.current?.setValue(JSON.stringify(output.data, null, 4));
          } catch (e) {
            console.error(e);
          }
        }
      }
    },
    [client, inputEditorRef, outputEditorRef, variableEditorRef]
  );

  const onSubmit = useCallback(async () => {
    const query = parse(inputEditorRef.current?.getValue() ?? '');
    const variables = JSON.parse(variableEditorRef.current?.getValue() ?? '');

    const response = await client.query({ query, variables });
    outputEditorRef.current?.setValue(JSON.stringify(response.data, null, 4));
  }, [client, inputEditorRef, outputEditorRef, variableEditorRef]);

  return {
    selectedQueryOption: selectedOption,
    queryOptions,
    onOptionSelect,

    onInputMount,
    onVariableMount,
    onOutputMount,

    onSubmit,
  };
};

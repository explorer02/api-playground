//lib
import { useMemo } from 'react';

//components
import { Form } from '../form';
import { Snippet } from '../snippet';

//hooks
import { useFetchAndMutate } from './hooks/useFetchAndMutate';
import { useMonacoMount } from '@/hooks/useMonacoMount';

//types
import { FetchAndMutateConfig } from '@/types';

const SNIPPET_CLASSNAME = 'flex-1 flex-grow-2';

export const FetchAndMutate = ({ config }: { config: FetchAndMutateConfig }) => {
  const {
    fetchConfig: { fieldConfigMap, formLayout, initialValues, validator, output: queryOutput },
    mutateConfig: { output: mutationOutput },
  } = config;

  const { editorRef: queryOutputEditorRef, onMount: onQueryOutputEditorMount } = useMonacoMount();
  const { editorRef: mutationOutputEditorRef, onMount: onMutationOutputEditorMount } = useMonacoMount();

  const {
    fetching,
    mutating,

    queryActions,
    onQueryActionClick,

    queryResponseErrors,
    handleQueryResponseChange,

    onAction,
    formErrors,
    formValues,
  } = useFetchAndMutate({ config, queryOutputEditorRef, mutationOutputEditorRef });

  const queryOutputEditorProps = useMemo(
    () => ({ onMount: onQueryOutputEditorMount, onChange: handleQueryResponseChange }),
    [handleQueryResponseChange, onQueryOutputEditorMount]
  );

  const mutationOutputEditorProps = useMemo(
    () => ({ onMount: onMutationOutputEditorMount }),
    [onMutationOutputEditorMount]
  );

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <Form
          fieldConfigMap={fieldConfigMap}
          layout={formLayout}
          values={formValues}
          errors={formErrors}
          onAction={onAction}
          loading={fetching}
        />
      </div>
      <Snippet
        title={queryOutput?.title ?? 'Output'}
        className={SNIPPET_CLASSNAME}
        editorProps={queryOutputEditorProps}
        loading={fetching}
        actions={queryActions}
        errors={queryResponseErrors}
        onActionClick={onQueryActionClick}
      />
      <Snippet
        editorProps={mutationOutputEditorProps}
        title={mutationOutput?.title ?? 'Response'}
        className={SNIPPET_CLASSNAME}
        loading={mutating}
      />
    </div>
  );
};

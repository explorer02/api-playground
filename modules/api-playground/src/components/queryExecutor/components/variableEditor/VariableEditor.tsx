//lib
import { memo, useMemo } from 'react';
import { OnMount } from '@monaco-editor/react';

//components
import { Snippet } from '@/components/snippet';

//hooks
import { useVariableEditor } from './hooks/useVariableEditor';

//types
import { QueryExecutorConfig } from '@/types';
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  config: QueryExecutorConfig;
  onSubmit: () => void;
  onMount?: OnMount;
  className?: ClassName;
};

const VariableEditor = ({ config, onSubmit, className, onMount: parentOnMount }: Props) => {
  const { config: { variable } = {} } = config;

  const { onChange, onMount, errors } = useVariableEditor({ onSubmit, parentOnMount });

  const editorProps = useMemo(() => ({ onMount, onChange }), [onChange, onMount]);

  return (
    <Snippet editorProps={editorProps} errors={errors} title={variable?.title ?? 'Variables'} className={className} />
  );
};

const MemoizedVariableEditor = memo(VariableEditor);

export { MemoizedVariableEditor as VariableEditor };

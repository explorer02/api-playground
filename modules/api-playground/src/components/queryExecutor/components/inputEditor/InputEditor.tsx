//lib
import { useMemo } from 'react';
import { OnMount } from '@monaco-editor/react';

//components
import { Snippet } from '@/components/snippet';

//hooks
import { useInputEditor } from './hooks/useInputEditor';

//types
import { QueryExecutorConfig } from '@/types';
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  config: QueryExecutorConfig;
  onSubmit: () => void;
  onMount?: OnMount;
  className?: ClassName;
};

export const InputEditor = ({ config, onSubmit, onMount: parentOnMount, className }: Props) => {
  const { config: { input } = {} } = config;

  const { onMount, onChange, errors } = useInputEditor({ onSubmit, parentOnMount });

  const editorProps = useMemo(() => ({ onChange, onMount, language: 'graqhql' }), [onChange, onMount]);

  return <Snippet editorProps={editorProps} title={input?.title ?? 'Query'} className={className} errors={errors} />;
};

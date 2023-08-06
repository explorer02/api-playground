//lib
import { memo, useMemo } from 'react';
import { OnMount } from '@monaco-editor/react';

//components
import { Snippet } from '@/components/snippet';

//types
import { QueryExecutorConfig } from '@/types';
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  config: QueryExecutorConfig;
  onMount: OnMount;
  className?: ClassName;
  loading?: boolean;
};

const OutputEditor = ({ config, onMount, className, loading }: Props) => {
  const { config: { output: { readOnly, title } = { readOnly: true, title: 'Output' } } = {} } = config;

  const editorProps = useMemo(() => ({ onMount, readOnly }), [onMount, readOnly]);

  return <Snippet editorProps={editorProps} title={title ?? 'Output'} className={className} loading={loading} />;
};

const MemoizedOutputEditor = memo(OutputEditor);

export { MemoizedOutputEditor as OutputEditor };

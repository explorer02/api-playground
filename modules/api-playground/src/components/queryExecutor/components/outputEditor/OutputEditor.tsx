//lib
import { memo, useMemo } from 'react';
import { OnMount } from '@monaco-editor/react';

//components
import { Snippet } from '@/components/snippet';

type Props = {
  title?: string;
  readOnly?: boolean;
  onMount: OnMount;
  className?: string;
  loading?: boolean;
};

const OutputEditor = ({ title, readOnly, onMount, className, loading }: Props) => {
  const editorProps = useMemo(() => ({ onMount, readOnly }), [onMount, readOnly]);

  return <Snippet editorProps={editorProps} title={title ?? 'Output'} className={className} loading={loading} />;
};

const MemoizedOutputEditor = memo(OutputEditor);

export { MemoizedOutputEditor as OutputEditor };

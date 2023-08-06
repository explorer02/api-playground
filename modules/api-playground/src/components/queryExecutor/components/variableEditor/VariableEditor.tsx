//lib
import { memo, useMemo } from 'react';
import { OnMount } from '@monaco-editor/react';

//components
import { Snippet } from '@/components/snippet';

//hooks
import { useVariableEditor } from './hooks/useVariableEditor';

//types
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  title?: string;
  onSubmit: () => void;
  onMount?: OnMount;
  className?: ClassName;
};

const VariableEditor = ({ title, onSubmit, className, onMount: parentOnMount }: Props) => {
  const { onChange, onMount, errors } = useVariableEditor({ onSubmit, parentOnMount });

  const editorProps = useMemo(() => ({ onMount, onChange }), [onChange, onMount]);

  return <Snippet editorProps={editorProps} errors={errors} title={title ?? 'Variables'} className={className} />;
};

const MemoizedVariableEditor = memo(VariableEditor);

export { MemoizedVariableEditor as VariableEditor };

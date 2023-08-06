//lib
import { useMemo } from 'react';
import { OnMount } from '@monaco-editor/react';

//components
import { Snippet } from '@/components/snippet';

//hooks
import { useInputEditor } from './hooks/useInputEditor';

//constants
import { Language } from '@/constants/language';

//types
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  title?: string;
  onSubmit: () => void;
  onMount?: OnMount;
  className?: ClassName;
};

export const InputEditor = ({ title, onSubmit, onMount: parentOnMount, className }: Props) => {
  const { onMount, onChange, errors } = useInputEditor({ onSubmit, parentOnMount });

  const editorProps = useMemo(() => ({ onChange, onMount, language: Language.GRAPHQL }), [onChange, onMount]);

  return <Snippet editorProps={editorProps} title={title ?? 'Query'} className={className} errors={errors} />;
};

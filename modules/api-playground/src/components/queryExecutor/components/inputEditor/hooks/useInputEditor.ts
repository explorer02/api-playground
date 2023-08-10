//lib
import { useCallback, useRef, useState } from 'react';
import { parse } from 'graphql';
import { OnChange, OnMount } from '@monaco-editor/react';

//types
import { MonacoEditorType } from '@/monaco';

type Params = {
  parentOnMount?: OnMount;
  onSubmit: () => void;
};

type ReturnType = {
  errors: boolean;
  onMount: OnMount;
  onChange: OnChange;
};

export const useInputEditor = ({ parentOnMount, onSubmit }: Params): ReturnType => {
  const [errors, setErrors] = useState(true);
  const editorRef = useRef<MonacoEditorType>();

  const onChange = useCallback<OnChange>(content => {
    try {
      const parsedGQLNode = parse(content ?? '');
      setErrors(false);
    } catch {
      setErrors(true);
    }
  }, []);

  const onMount = useCallback<OnMount>(
    (mEditor, _monaco) => {
      editorRef.current = mEditor;
      parentOnMount?.(mEditor, _monaco);
      editorRef.current?.onKeyDown(ev => {
        if (ev.metaKey && ev.keyCode === 3) {
          if (!latestErrors.current) {
            onSubmit();
          }
          ev.stopPropagation();
        }
      });
    },
    [onSubmit, parentOnMount]
  );

  const latestErrors = useRef(errors);
  latestErrors.current = errors;

  return {
    errors,
    onChange,
    onMount,
  };
};

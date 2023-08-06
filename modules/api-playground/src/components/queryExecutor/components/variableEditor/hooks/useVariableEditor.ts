//lib
import { useCallback, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { OnChange, OnMount } from '@monaco-editor/react';

type Params = {
  parentOnMount?: OnMount;
  onSubmit: () => void;
};

type ReturnType = {
  errors: boolean;
  onMount: OnMount;
  onChange: OnChange;
};

export const useVariableEditor = ({ parentOnMount, onSubmit }: Params): ReturnType => {
  const [errors, setErrors] = useState(true);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onChange = useCallback<OnChange>(content => {
    try {
      const parsedVariables = JSON.parse(content ?? '');
      setErrors(false);
    } catch {
      setErrors(true);
    }
  }, []);

  const onKeyDown = useCallback(
    (ev: monaco.IKeyboardEvent) => {
      if (ev.metaKey && ev.keyCode === monaco.KeyCode.Enter && !latestErrors.current) {
        onSubmit();
      }
    },
    [onSubmit]
  );

  const onMount = useCallback<OnMount>(
    (mEditor, _monaco) => {
      editorRef.current = mEditor;
      parentOnMount?.(mEditor, _monaco);
    },
    [parentOnMount]
  );

  const latestErrors = useRef(errors);
  latestErrors.current = errors;

  return {
    errors,
    onChange,
    onMount,
  };
};

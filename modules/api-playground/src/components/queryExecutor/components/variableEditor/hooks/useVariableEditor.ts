//lib
import { useCallback, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { OnChange, OnMount } from '@monaco-editor/react';

//hooks
import { useValidateJSON } from '@/hooks/useValidateJSON';

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
  const { errors, handleChange } = useValidateJSON();

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMount = useCallback<OnMount>(
    (mEditor, _monaco) => {
      editorRef.current = mEditor;
      parentOnMount?.(mEditor, _monaco);
      editorRef.current.onKeyDown(ev => {
        if (ev.metaKey && ev.keyCode === monaco.KeyCode.Enter) {
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
    onChange: handleChange,
    onMount,
  };
};

import { useCallback, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { OnMount } from '@monaco-editor/react';

export const useMonacoMount = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMount = useCallback<OnMount>(mEditor => {
    editorRef.current = mEditor;
  }, []);

  return { editorRef, onMount };
};

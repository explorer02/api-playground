import { useCallback, useRef } from 'react';
import { OnMount } from '@monaco-editor/react';

import { MonacoEditorType } from '@/monaco';

export const useMonacoMount = () => {
  const editorRef = useRef<MonacoEditorType>();

  const onMount = useCallback<OnMount>(mEditor => {
    editorRef.current = mEditor;
  }, []);

  return { editorRef, onMount };
};

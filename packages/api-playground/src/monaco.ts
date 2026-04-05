import { EditorProps, OnMount } from '@monaco-editor/react';
import { KeyboardEventHandler } from 'react';

export type MonacoEditorOptions = EditorProps['options'];

export type MonacoEditorType = {
  onKeyDown: (p: KeyboardEventHandler) => void;
  getValue: () => string | undefined;
  focus: () => void;
  setValue: (v: string) => void;
  getAction: (action: string) => { run: () => void } | undefined;
};

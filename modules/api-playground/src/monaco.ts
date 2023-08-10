import { EditorProps, OnMount } from '@monaco-editor/react';

export type MonacoEditorOptions = EditorProps['options'];

export type MonacoEditorType = Parameters<OnMount>[0];

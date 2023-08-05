//lib
import { useCallback, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useCopyToClipboard } from 'react-use';

//components
import { VscCopy } from 'react-icons/vsc';
import { VscBracketDot } from 'react-icons/vsc';
import { VscSave } from 'react-icons/vsc';

//utils
import { downloadJSON } from '@/utils/downloadJSON';

//types
import { Action } from './types';

const ACTION_TYPE = {
  FORMAT: 'FORMAT',
  COPY: 'COPY',
  DOWNLOAD: 'DOWNLOAD',
};

const ACTIONS = [
  { id: ACTION_TYPE.FORMAT, label: 'Format', Icon: VscBracketDot },
  { id: ACTION_TYPE.COPY, label: 'Copy', Icon: VscCopy },
  { id: ACTION_TYPE.DOWNLOAD, label: 'Download', Icon: VscSave },
];

type Params = {
  title: string;
  onActionClick?: (action: string) => void;
  onParentMount?: (mEditor: monaco.editor.IStandaloneCodeEditor) => void;
};

type ReturnType = {
  onMount: (mEditor: monaco.editor.IStandaloneCodeEditor) => void;
  actions: Action[];
  onActionClick: (action: string) => void;
};

export const useMonacoActions = ({ title, onActionClick: onParentActionClick, onParentMount }: Params): ReturnType => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMount = useCallback(
    (mEditor: monaco.editor.IStandaloneCodeEditor) => {
      editorRef.current = mEditor;
      onParentMount?.(mEditor);
    },
    [onParentMount]
  );

  const [_, copyToClipboard] = useCopyToClipboard();

  const onActionClick = useCallback(
    (action: string) => {
      switch (action) {
        case ACTION_TYPE.COPY: {
          const content = editorRef.current?.getValue();
          copyToClipboard(content ?? '');
          break;
        }
        case ACTION_TYPE.DOWNLOAD: {
          const content = editorRef.current?.getValue();
          downloadJSON(content ?? '', `${title}.json`);
          break;
        }
        case ACTION_TYPE.FORMAT:
          editorRef.current?.getAction('editor.action.formatDocument')?.run();
          editorRef.current?.focus();
          break;
        default:
          onParentActionClick?.(action);
      }
    },
    [copyToClipboard, onParentActionClick, title]
  );

  return { actions: ACTIONS, onMount, onActionClick };
};

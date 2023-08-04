//lib
import { MouseEvent, useCallback, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useCopyToClipboard } from 'react-use';

//components
import { RiFileCopyFill } from 'react-icons/ri';
import { LiaDownloadSolid } from 'react-icons/lia';
import { PiBracketsCurly } from 'react-icons/pi';

//utils
import { downloadJSON } from '@/utils/downloadJSON';

//types
import { IconType } from 'react-icons';

type Action = {
  id: string;
  label: string;
  Icon: IconType;
};

const ACTION_TYPE = {
  FORMAT: 'FORMAT',
  COPY: 'COPY',
  DOWNLOAD: 'DOWNLOAD',
};

const ACTIONS = [
  { id: ACTION_TYPE.FORMAT, label: 'Format', Icon: PiBracketsCurly },
  { id: ACTION_TYPE.COPY, label: 'Copy', Icon: RiFileCopyFill },
  { id: ACTION_TYPE.DOWNLOAD, label: 'Download', Icon: LiaDownloadSolid },
];

type ReturnType = {
  onMount: (mEditor: monaco.editor.IStandaloneCodeEditor) => void;
  actions: Action[];
  onActionClick: (ev: MouseEvent<HTMLElement>) => void;
};

export const useMonacoActions = ({ initialContent, title }: { initialContent?: string; title: string }): ReturnType => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMount = useCallback((mEditor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = mEditor;
    // editor.getAction('editor.action.formatDocument').run()
  }, []);

  const [_, copyToClipboard] = useCopyToClipboard();

  const onActionClick = useCallback(
    (ev: MouseEvent<HTMLElement>) => {
      switch (ev.currentTarget.dataset.id) {
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
          break;
      }
    },
    [copyToClipboard, title]
  );

  return { actions: ACTIONS, onMount, onActionClick };
};

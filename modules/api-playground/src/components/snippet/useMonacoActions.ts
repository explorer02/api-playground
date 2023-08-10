//lib
import { useCallback, useRef } from 'react';
import { useCopyToClipboard } from 'react-use';
import { OnMount } from '@monaco-editor/react';

//components
import { VscCopy } from 'react-icons/vsc';
import { VscBracketDot } from 'react-icons/vsc';
import { VscSave } from 'react-icons/vsc';

//utils
import { downloadFile } from '@/utils/downloadFile';
import { prettifyGQL } from '@/utils/prettifyGQL';

//constants
import { Language } from '@/constants/language';

//types
import { Action } from './types';
import { MonacoEditorType } from '@/monaco';

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
  onParentMount?: OnMount;
  language: Language;
};

type ReturnType = {
  onMount: OnMount;
  actions: Action[];
  onActionClick: (action: string) => void;
};

export const useMonacoActions = ({
  title,
  onActionClick: onParentActionClick,
  onParentMount,
  language,
}: Params): ReturnType => {
  const editorRef = useRef<MonacoEditorType>();

  const onMount = useCallback<OnMount>(
    (mEditor, _monaco) => {
      editorRef.current = mEditor;
      onParentMount?.(mEditor, _monaco);
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
          downloadFile(content ?? '', title, language);
          break;
        }

        case ACTION_TYPE.FORMAT:
          {
            switch (language) {
              case Language.GRAPHQL: {
                try {
                  editorRef.current?.setValue(prettifyGQL(editorRef.current.getValue()));
                } catch {}
                break;
              }

              default: {
                editorRef.current?.getAction('editor.action.formatDocument')?.run();
                editorRef.current?.focus();
                break;
              }
            }
          }
          break;

        default:
          onParentActionClick?.(action);
      }
    },
    [copyToClipboard, language, onParentActionClick, title]
  );

  return { actions: ACTIONS, onMount, onActionClick };
};

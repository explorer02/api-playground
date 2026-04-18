import { useCallback } from 'react';
import { VscSend } from 'react-icons/vsc';
import { OnMount } from '@monaco-editor/react';

import { Snippet } from '~/components/snippet';
import { Language } from '~/constants/language';

import { useMonacoMount } from '~/hooks/useMonacoMount';

import { ConnectionStatus } from '../types';

type Props = {
  connectionStatus: ConnectionStatus;
  onSend: (data: string) => void;
  draft: string;
  setDraft: (value: string) => void;
};

export const MessageInput = ({ connectionStatus, onSend, draft, setDraft }: Props) => {
  const { editorRef, onMount: rawMount } = useMonacoMount();
  const isConnected = connectionStatus === 'connected';

  const onMount = useCallback<OnMount>(
    (editor, monaco) => {
      rawMount(editor, monaco);
      if (draft) editor.setValue(draft);
      editor.onDidChangeModelContent(() => setDraft(editor.getValue()));
    },
    [rawMount, draft, setDraft]
  );

  const handleSend = useCallback(() => {
    const value = editorRef.current?.getValue();
    if (value?.trim()) {
      onSend(value);
    }
  }, [editorRef, onSend]);

  return (
    <div className="flex-1 flex flex-col gap-2">
      <Snippet
        title="Message"
        className="flex-1"
        editorProps={{
          onMount,
          language: Language.JSON,
        }}
        actions={[
          {
            id: 'SEND',
            label: 'Send',
            Icon: VscSend,
            type: 'cta',
            disabled: !isConnected,
          },
        ]}
        onActionClick={action => {
          if (action === 'SEND') handleSend();
        }}
      />
    </div>
  );
};

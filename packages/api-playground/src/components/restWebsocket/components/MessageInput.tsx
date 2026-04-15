import { useCallback } from 'react';
import { VscSend } from 'react-icons/vsc';

import { Snippet } from '~/components/snippet';
import { Language } from '~/constants/language';

import { useMonacoMount } from '~/hooks/useMonacoMount';

import { ConnectionStatus } from '../types';

type Props = {
  connectionStatus: ConnectionStatus;
  onSend: (data: string) => void;
};

export const MessageInput = ({ connectionStatus, onSend }: Props) => {
  const { editorRef, onMount } = useMonacoMount();
  const isConnected = connectionStatus === 'connected';

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
        onActionClick={(action) => {
          if (action === 'SEND') handleSend();
        }}
      />
    </div>
  );
};

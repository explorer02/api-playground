import { useCallback } from 'react';
import { OnMount } from '@monaco-editor/react';

import { HeadersEditor } from '~/components/restApi/components/HeadersEditor';
import { ConnectionBar } from '~/shared/connectionBar/ConnectionBar';
import { SseOutputPanel } from './components/SseOutputPanel';

import { useSse } from './hooks/useSse';
import { useMonacoMount } from '~/hooks/useMonacoMount';

import { SseConfig } from '~/types';

export const Sse = ({ config, tabId }: { config: SseConfig; tabId: string }) => {
  const {
    url,
    setUrl,
    headers,
    addHeader,
    removeHeader,
    updateHeader,
    events,
    connectionStatus,
    stats,
    connect,
    disconnect,
  } = useSse({
    tabId,
    defaultUrl: config.url,
    defaultHeaders: config.headers,
  });

  const { editorRef, onMount: onMountBase } = useMonacoMount();

  const onMount = useCallback<OnMount>(
    (editor, monaco) => {
      onMountBase(editor, monaco);
      if (events) editor.setValue(events);
    },
    [onMountBase, events]
  );

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <ConnectionBar
          url={url}
          setUrl={setUrl}
          connectionStatus={connectionStatus}
          onConnect={connect}
          onDisconnect={disconnect}
          placeholder="Enter SSE URL"
        />
        <HeadersEditor
          headers={headers}
          addHeader={addHeader}
          removeHeader={removeHeader}
          updateHeader={updateHeader}
        />
      </div>
      <SseOutputPanel
        events={events}
        connectionStatus={connectionStatus}
        stats={stats}
        editorRef={editorRef}
        onMount={onMount}
      />
    </div>
  );
};

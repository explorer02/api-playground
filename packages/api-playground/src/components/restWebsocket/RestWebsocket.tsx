import { ConnectionBar } from '~/shared/connectionBar/ConnectionBar';
import { MessageInput } from './components/MessageInput';
import { MessageLog } from './components/MessageLog';

import { useRestWebsocket } from './hooks/useRestWebsocket';

import { RestWebsocketConfig } from '~/types';

export const RestWebsocket = ({ config }: { config: RestWebsocketConfig }) => {
  const {
    url,
    setUrl,
    messages,
    connectionStatus,
    stats,
    connect,
    disconnect,
    sendMessage,
  } = useRestWebsocket({
    defaultUrl: config.url,
  });

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <ConnectionBar
          url={url}
          setUrl={setUrl}
          connectionStatus={connectionStatus}
          onConnect={connect}
          onDisconnect={disconnect}
          placeholder="Enter WebSocket URL (ws:// or wss://)"
        />
        <MessageInput connectionStatus={connectionStatus} onSend={sendMessage} />
      </div>
      <MessageLog messages={messages} connectionStatus={connectionStatus} stats={stats} />
    </div>
  );
};

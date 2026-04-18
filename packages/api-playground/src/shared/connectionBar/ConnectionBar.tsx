import { VscDebugStart, VscDebugStop } from 'react-icons/vsc';

import { Button } from '~/shared/button/Button';
import { Input } from '~/shared/input';

import { ConnectionStatus } from '~/types';

type Props = {
  url: string;
  setUrl: (url: string) => void;
  connectionStatus: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  placeholder?: string;
};

export const ConnectionBar = ({
  url,
  setUrl,
  connectionStatus,
  onConnect,
  onDisconnect,
  placeholder = 'Enter URL',
}: Props) => {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <div className="flex-none flex gap-3 items-center">
      <Input
        className="flex-1"
        placeholder={placeholder}
        value={url}
        onChange={e => setUrl(e.target.value)}
        readOnly={isConnected || isConnecting}
      />
      {isConnected ? (
        <Button className="flex-none" size="xs" tooltipContent="Disconnect" onClick={onDisconnect} icon>
          <VscDebugStop />
        </Button>
      ) : (
        <Button
          className="flex-none"
          size="xs"
          tooltipContent="Connect"
          onClick={onConnect}
          icon
          disabled={isConnecting || !url.trim()}
        >
          <VscDebugStart />
        </Button>
      )}
    </div>
  );
};

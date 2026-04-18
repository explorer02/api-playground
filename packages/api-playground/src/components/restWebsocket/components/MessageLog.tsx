import { useEffect, useRef } from 'react';
import { VscArrowUp, VscArrowDown } from 'react-icons/vsc';

import { Typography } from '~/shared/typography';

import { STATUS_COLORS, formatDuration } from '~/utils/connectionUtils';
import { ConnectionStatus, WsMessage, WsStats } from '../types';

type Props = {
  messages: WsMessage[];
  connectionStatus: ConnectionStatus;
  stats: WsStats | null;
};

const formatTime = (ts: number): string => {
  return new Date(ts).toLocaleTimeString();
};

export const MessageLog = ({ messages, connectionStatus, stats }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col border-solid border rounded-8 expr-ui-01 expr-border-03 relative">
      <div className="flex-none flex px-3 py-2 items-center border-0 border-b border-solid expr-border-03">
        <Typography variant="h5" className="ml-1">
          Messages
        </Typography>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Typography variant="body-16" className="expr-text-03">
              {connectionStatus === 'connected' ? 'Waiting for messages...' : 'Connect to start'}
            </Typography>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className="rounded-8 px-3 py-2 border-solid border expr-border-03"
              style={{
                backgroundColor: msg.direction === 'sent' ? 'rgba(59, 130, 246, 0.06)' : 'rgba(34, 197, 94, 0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-1" style={{ fontSize: '11px' }}>
                <span
                  aria-label={msg.direction === 'sent' ? 'Sent message' : 'Received message'}
                  className="flex items-center gap-1 font-semibold"
                  style={{ color: msg.direction === 'sent' ? '#3b82f6' : '#22c55e' }}
                >
                  {msg.direction === 'sent' ? <VscArrowUp size={12} /> : <VscArrowDown size={12} />}
                  {msg.direction === 'sent' ? 'SENT' : 'RECEIVED'}
                </span>
                <span className="expr-text-03">{formatTime(msg.timestamp)}</span>
              </div>
              <pre
                className="m-0"
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {msg.data}
              </pre>
            </div>
          ))
        )}
      </div>
      {stats || connectionStatus !== 'disconnected' ? (
        <div
          role="status"
          aria-live="polite"
          className="flex-none px-3 py-1 expr-ui-02 border-0 border-t border-solid expr-border-03 flex gap-3 items-center expr-text-03"
          style={{ fontSize: '12px' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: STATUS_COLORS[connectionStatus],
                display: 'inline-block',
              }}
            />
            {connectionStatus}
          </span>
          {stats ? (
            <>
              <span>|</span>
              <span>
                ▲{stats.messagesSent} ▼{stats.messagesReceived}
              </span>
              <span>|</span>
              <span>{formatDuration(stats.connectionDuration)}</span>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

import { useCallback, useEffect, useRef, useState } from 'react';

import { ConnectionStatus, WsMessage, WsStats } from '../types';

type Params = {
  defaultUrl?: string;
};

export const useRestWebsocket = ({ defaultUrl }: Params) => {
  const [url, setUrl] = useState(defaultUrl ?? '');
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<WsStats | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const statsRef = useRef<WsStats>({ connectionDuration: 0, messagesSent: 0, messagesReceived: 0 });
  const messageIdRef = useRef(0);
  const nextMessageId = () => `msg-${++messageIdRef.current}`;

  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!url.trim()) return;

    cleanup();
    setConnectionStatus('connecting');
    setMessages([]);
    statsRef.current = { connectionDuration: 0, messagesSent: 0, messagesReceived: 0 };
    setStats(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      startTimeRef.current = performance.now();

      ws.onopen = () => {
        setConnectionStatus('connected');
        durationIntervalRef.current = setInterval(() => {
          statsRef.current = {
            ...statsRef.current,
            connectionDuration: Math.round(performance.now() - startTimeRef.current),
          };
          setStats({ ...statsRef.current });
        }, 1000);
      };

      ws.onmessage = (event) => {
        const msg: WsMessage = {
          id: nextMessageId(),
          direction: 'received',
          data: typeof event.data === 'string' ? event.data : String(event.data),
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, msg]);
        statsRef.current = {
          ...statsRef.current,
          messagesReceived: statsRef.current.messagesReceived + 1,
        };
        setStats({ ...statsRef.current });
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        cleanup();
      };

      ws.onerror = () => {
        setConnectionStatus('error');
        cleanup();
      };
    } catch {
      setConnectionStatus('error');
      cleanup();
    }
  }, [url, cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionStatus('disconnected');
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const sendMessage = useCallback((data: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !data.trim()) return;

    wsRef.current.send(data);
    const msg: WsMessage = {
      id: nextMessageId(),
      direction: 'sent',
      data,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, msg]);
    statsRef.current = {
      ...statsRef.current,
      messagesSent: statsRef.current.messagesSent + 1,
    };
    setStats({ ...statsRef.current });
  }, []);

  return {
    url,
    setUrl,
    messages,
    connectionStatus,
    stats,
    connect,
    disconnect,
    sendMessage,
  };
};

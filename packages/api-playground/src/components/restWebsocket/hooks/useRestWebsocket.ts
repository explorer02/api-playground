import { useCallback, useEffect, useRef, useState } from 'react';

import { RestWebsocketTabState, useTabState } from '~/context/TabStateContext';

import { WsMessage, WsStats } from '../types';
import { ConnectionStatus } from '~/types';

type Params = {
  tabId: string;
  defaultUrl?: string;
};

export const useRestWebsocket = ({ tabId, defaultUrl }: Params) => {
  const { getState, setState } = useTabState();
  const saved = getState<RestWebsocketTabState>(tabId);

  const [url, setUrl] = useState(saved?.url ?? defaultUrl ?? '');
  const [messageDraft, setMessageDraft] = useState(saved?.messageDraft ?? '');
  const [messages, setMessages] = useState<WsMessage[]>(saved?.messages ?? []);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<WsStats | null>(null);

  const persist = useCallback(
    (patch: Partial<Omit<RestWebsocketTabState, 'type'>>) => {
      const current = getState<RestWebsocketTabState>(tabId);
      setState<RestWebsocketTabState>(tabId, {
        type: 'REST_WEBSOCKET',
        url: '',
        messageDraft: '',
        messages: [],
        connectionStatus: 'disconnected',
        ...current,
        ...patch,
      });
    },
    [tabId, getState, setState]
  );

  const setUrlPersist = useCallback(
    (next: string | ((prev: string) => string)) => {
      setUrl(prev => {
        const value = typeof next === 'function' ? next(prev) : next;
        persist({ url: value });
        return value;
      });
    },
    [persist]
  );

  const setMessageDraftPersist = useCallback(
    (next: string | ((prev: string) => string)) => {
      setMessageDraft(prev => {
        const value = typeof next === 'function' ? next(prev) : next;
        persist({ messageDraft: value });
        return value;
      });
    },
    [persist]
  );

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

  const appendMessage = useCallback(
    (msg: WsMessage) => {
      setMessages(prev => {
        const next = [...prev, msg];
        persist({ messages: next });
        return next;
      });
    },
    [persist]
  );

  const connect = useCallback(() => {
    if (!url.trim()) return;

    cleanup();
    setConnectionStatus('connecting');
    setMessages([]);
    statsRef.current = { connectionDuration: 0, messagesSent: 0, messagesReceived: 0 };
    setStats(null);
    persist({ connectionStatus: 'connecting', messages: [] });

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      startTimeRef.current = performance.now();

      ws.onopen = () => {
        setConnectionStatus('connected');
        persist({ connectionStatus: 'connected' });
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
        appendMessage(msg);
        statsRef.current = {
          ...statsRef.current,
          messagesReceived: statsRef.current.messagesReceived + 1,
        };
        setStats({ ...statsRef.current });
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        persist({ connectionStatus: 'disconnected' });
        cleanup();
      };

      ws.onerror = () => {
        setConnectionStatus('error');
        persist({ connectionStatus: 'error' });
        cleanup();
      };
    } catch {
      setConnectionStatus('error');
      persist({ connectionStatus: 'error' });
      cleanup();
    }
  }, [url, cleanup, appendMessage, persist]);

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionStatus('disconnected');
    persist({ connectionStatus: 'disconnected' });
  }, [cleanup, persist]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const sendMessage = useCallback(
    (data: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !data.trim()) return;

      wsRef.current.send(data);
      const msg: WsMessage = {
        id: nextMessageId(),
        direction: 'sent',
        data,
        timestamp: Date.now(),
      };
      appendMessage(msg);
      statsRef.current = {
        ...statsRef.current,
        messagesSent: statsRef.current.messagesSent + 1,
      };
      setStats({ ...statsRef.current });
    },
    [appendMessage]
  );

  return {
    url,
    setUrl: setUrlPersist,
    messageDraft,
    setMessageDraft: setMessageDraftPersist,
    messages,
    connectionStatus,
    stats,
    connect,
    disconnect,
    sendMessage,
  };
};

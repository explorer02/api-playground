import { useCallback, useEffect, useRef, useState } from 'react';

import { createGraphqlWsClient } from '~/utils/graphqlWsProtocol';
import { prettifyJSON } from '~/utils/prettifyJSON';

import { ConnectionStatus, SubscriptionStats } from '../types';

type Params = {
  defaultWsUrl?: string;
  defaultQuery?: string;
  defaultVariables?: string;
};

export const useGqlSubscription = ({ defaultWsUrl, defaultQuery, defaultVariables }: Params) => {
  const [wsUrl, setWsUrl] = useState(defaultWsUrl ?? '');
  const [events, setEvents] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<SubscriptionStats | null>(null);

  const clientRef = useRef<{ close: () => void } | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const eventsRef = useRef('');
  const statsRef = useRef<SubscriptionStats>({ connectionDuration: 0, messagesReceived: 0 });

  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (clientRef.current) {
      clientRef.current.close();
      clientRef.current = null;
    }
  }, []);

  const connect = useCallback(
    (query: string, variables: string) => {
      if (!wsUrl.trim() || !query.trim()) return;

      cleanup();
      setConnectionStatus('connecting');
      setEvents('');
      eventsRef.current = '';
      statsRef.current = { connectionDuration: 0, messagesReceived: 0 };
      setStats(null);

      let parsedVariables: Record<string, unknown> | undefined;
      try {
        parsedVariables = variables.trim() ? JSON.parse(variables) : undefined;
      } catch {
        parsedVariables = undefined;
      }

      startTimeRef.current = performance.now();

      const client = createGraphqlWsClient(wsUrl, query, parsedVariables, {
        onConnected: () => {
          setConnectionStatus('connected');
          durationIntervalRef.current = setInterval(() => {
            statsRef.current = {
              ...statsRef.current,
              connectionDuration: Math.round(performance.now() - startTimeRef.current),
            };
            setStats({ ...statsRef.current });
          }, 1000);
        },

        onData: (data) => {
          const formatted = prettifyJSON(data as object);
          const separator = eventsRef.current ? '\n---\n' : '';
          eventsRef.current += separator + formatted;
          statsRef.current = {
            ...statsRef.current,
            messagesReceived: statsRef.current.messagesReceived + 1,
          };
          setEvents(eventsRef.current);
          setStats({ ...statsRef.current });
        },

        onError: (error) => {
          const msg = typeof error === 'string' ? error : JSON.stringify(error);
          const separator = eventsRef.current ? '\n---\n' : '';
          eventsRef.current += separator + `Error: ${msg}`;
          setEvents(eventsRef.current);
          setConnectionStatus('error');
          cleanup();
        },

        onComplete: () => {
          setConnectionStatus('disconnected');
          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
          }
        },
      });

      clientRef.current = client;
    },
    [wsUrl, cleanup]
  );

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionStatus('disconnected');
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    wsUrl,
    setWsUrl,
    defaultQuery,
    defaultVariables,
    events,
    connectionStatus,
    stats,
    connect,
    disconnect,
  };
};

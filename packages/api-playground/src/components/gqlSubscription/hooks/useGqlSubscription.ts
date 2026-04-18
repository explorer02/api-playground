import { useCallback, useEffect, useRef, useState } from 'react';

import { GqlSubscriptionTabState, useTabState } from '~/context/TabStateContext';
import { createGraphqlWsClient } from '~/utils/graphqlWsProtocol';
import { prettifyJSON } from '~/utils/prettifyJSON';

import { SubscriptionStats } from '../types';
import { ConnectionStatus } from '~/types';

type Params = {
  tabId: string;
  defaultWsUrl?: string;
  defaultQuery?: string;
  defaultVariables?: string;
};

export const useGqlSubscription = ({ tabId, defaultWsUrl, defaultQuery, defaultVariables }: Params) => {
  const { getState, setState } = useTabState();
  const saved = getState<GqlSubscriptionTabState>(tabId);

  const [wsUrl, setWsUrl] = useState(saved?.wsUrl ?? defaultWsUrl ?? '');
  const [events, setEvents] = useState(saved?.events ?? '');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<SubscriptionStats | null>(null);

  const initialQuery = saved?.query ?? defaultQuery;
  const initialVariables = saved?.variables ?? defaultVariables;

  const persist = useCallback(
    (patch: Partial<Omit<GqlSubscriptionTabState, 'type'>>) => {
      const current = getState<GqlSubscriptionTabState>(tabId);
      setState<GqlSubscriptionTabState>(tabId, {
        type: 'GQL_SUBSCRIPTION',
        wsUrl: '',
        query: '',
        variables: '',
        events: '',
        connectionStatus: 'disconnected',
        ...current,
        ...patch,
      });
    },
    [tabId, getState, setState]
  );

  const saveQuery = useCallback((query: string) => persist({ query }), [persist]);
  const saveVariables = useCallback((variables: string) => persist({ variables }), [persist]);

  const setWsUrlPersist = useCallback(
    (next: string | ((prev: string) => string)) => {
      setWsUrl(prev => {
        const value = typeof next === 'function' ? next(prev) : next;
        persist({ wsUrl: value });
        return value;
      });
    },
    [persist]
  );

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

  const appendEvent = useCallback((text: string) => {
    const separator = eventsRef.current ? '\n---\n' : '';
    eventsRef.current += separator + text;
    setEvents(eventsRef.current);
    persist({ events: eventsRef.current });
  }, [persist]);

  const connect = useCallback(
    (query: string, variables: string) => {
      if (!wsUrl.trim() || !query.trim()) return;

      cleanup();
      setEvents('');
      eventsRef.current = '';
      statsRef.current = { connectionDuration: 0, messagesReceived: 0 };
      setStats(null);

      let parsedVariables: Record<string, unknown> | undefined;
      if (variables.trim()) {
        try {
          parsedVariables = JSON.parse(variables);
        } catch {
          setConnectionStatus('error');
          persist({ connectionStatus: 'error' });
          appendEvent('Error: invalid variables JSON');
          return;
        }
      }

      setConnectionStatus('connecting');
      persist({ connectionStatus: 'connecting', events: '' });
      startTimeRef.current = performance.now();

      const client = createGraphqlWsClient(wsUrl, query, parsedVariables, {
        onConnected: () => {
          setConnectionStatus('connected');
          persist({ connectionStatus: 'connected' });
          durationIntervalRef.current = setInterval(() => {
            statsRef.current = {
              ...statsRef.current,
              connectionDuration: Math.round(performance.now() - startTimeRef.current),
            };
            setStats({ ...statsRef.current });
          }, 1000);
        },

        onData: (data) => {
          const formatted = prettifyJSON(data);
          const separator = eventsRef.current ? '\n---\n' : '';
          eventsRef.current += separator + formatted;
          statsRef.current = {
            ...statsRef.current,
            messagesReceived: statsRef.current.messagesReceived + 1,
          };
          setEvents(eventsRef.current);
          setStats({ ...statsRef.current });
          persist({ events: eventsRef.current });
        },

        onError: (error) => {
          const msg = typeof error === 'string' ? error : JSON.stringify(error);
          appendEvent(`Error: ${msg}`);
          setConnectionStatus('error');
          persist({ connectionStatus: 'error' });
          cleanup();
        },

        onComplete: () => {
          setConnectionStatus('disconnected');
          persist({ connectionStatus: 'disconnected' });
          cleanup();
        },
      });

      clientRef.current = client;
    },
    [wsUrl, cleanup, appendEvent, persist]
  );

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionStatus('disconnected');
    persist({ connectionStatus: 'disconnected' });
  }, [cleanup, persist]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    wsUrl,
    setWsUrl: setWsUrlPersist,
    initialQuery,
    initialVariables,
    saveQuery,
    saveVariables,
    events,
    connectionStatus,
    stats,
    connect,
    disconnect,
  };
};

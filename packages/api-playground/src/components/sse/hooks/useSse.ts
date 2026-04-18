import { useCallback, useEffect, useRef, useState } from 'react';

import { SseTabState, useTabState } from '~/context/TabStateContext';
import { Header } from '~/components/restApi/types';

import { SseStats } from '../types';
import { ConnectionStatus } from '~/types';

type Params = {
  tabId: string;
  defaultUrl?: string;
  defaultHeaders?: Record<string, string>;
};

const toHeaderArray = (headers?: Record<string, string>): Header[] => {
  if (!headers) return [{ key: '', value: '' }];
  const entries = Object.entries(headers).map(([key, value]) => ({ key, value }));
  return entries.length > 0 ? entries : [{ key: '', value: '' }];
};

export const useSse = ({ tabId, defaultUrl, defaultHeaders }: Params) => {
  const { getState, setState } = useTabState();
  const saved = getState<SseTabState>(tabId);

  const [url, setUrl] = useState(saved?.url ?? defaultUrl ?? '');
  const [headers, setHeaders] = useState<Header[]>(saved?.headers ?? toHeaderArray(defaultHeaders));
  const [events, setEvents] = useState(saved?.events ?? '');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<SseStats | null>(null);

  const persist = useCallback(
    (patch: Partial<Omit<SseTabState, 'type'>>) => {
      const current = getState<SseTabState>(tabId);
      setState<SseTabState>(tabId, {
        type: 'SSE',
        url: '',
        headers: [{ key: '', value: '' }],
        events: '',
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

  const persistHeaders = useCallback(
    (updater: (prev: Header[]) => Header[]) => {
      setHeaders(prev => {
        const next = updater(prev);
        persist({ headers: next });
        return next;
      });
    },
    [persist]
  );

  const abortControllerRef = useRef<AbortController | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const eventsRef = useRef('');
  const statsRef = useRef<SseStats>({ connectionDuration: 0, eventsReceived: 0, totalBytes: 0 });

  const addHeader = useCallback(() => {
    persistHeaders(prev => [...prev, { key: '', value: '' }]);
  }, [persistHeaders]);

  const removeHeader = useCallback(
    (index: number) => {
      persistHeaders(prev => prev.filter((_, i) => i !== index));
    },
    [persistHeaders]
  );

  const updateHeader = useCallback(
    (index: number, field: 'key' | 'value', val: string) => {
      persistHeaders(prev => prev.map((h, i) => (i === index ? { ...h, [field]: val } : h)));
    },
    [persistHeaders]
  );

  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const writeEvents = useCallback(
    (next: string) => {
      eventsRef.current = next;
      setEvents(next);
      persist({ events: next });
    },
    [persist]
  );

  const connect = useCallback(async () => {
    if (!url.trim()) return;

    cleanup();
    setConnectionStatus('connecting');
    writeEvents('');
    statsRef.current = { connectionDuration: 0, eventsReceived: 0, totalBytes: 0 };
    setStats(null);
    persist({ connectionStatus: 'connecting' });

    const headerObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key.trim()) headerObj[h.key.trim()] = h.value;
    });

    const controller = new AbortController();
    abortControllerRef.current = controller;
    startTimeRef.current = performance.now();

    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      statsRef.current = {
        ...statsRef.current,
        connectionDuration: Math.round(performance.now() - startTimeRef.current),
      };
      setStats({ ...statsRef.current });
    }, 1000);

    try {
      const res = await fetch(url, {
        headers: headerObj,
        signal: controller.signal,
      });

      if (!res.ok) {
        setConnectionStatus('error');
        writeEvents(`Error: ${res.status} ${res.statusText}`);
        persist({ connectionStatus: 'error' });
        cleanup();
        return;
      }

      if (!res.body) {
        setConnectionStatus('error');
        writeEvents('Error: No response body (streaming not supported)');
        persist({ connectionStatus: 'error' });
        cleanup();
        return;
      }

      setConnectionStatus('connected');
      persist({ connectionStatus: 'connected' });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Parse SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (!data) continue;

            const separator = eventsRef.current ? '\n---\n' : '';
            const nextEvents = eventsRef.current + separator + data;
            statsRef.current = {
              ...statsRef.current,
              eventsReceived: statsRef.current.eventsReceived + 1,
              totalBytes: statsRef.current.totalBytes + new Blob([data]).size,
            };

            writeEvents(nextEvents);
            setStats({ ...statsRef.current });
          }
        }
      }

      // Stream ended naturally
      setConnectionStatus('disconnected');
      persist({ connectionStatus: 'disconnected' });
      cleanup();
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setConnectionStatus('disconnected');
        persist({ connectionStatus: 'disconnected' });
      } else {
        setConnectionStatus('error');
        const msg = e instanceof Error ? e.message : 'Connection failed';
        const separator = eventsRef.current ? '\n---\n' : '';
        writeEvents(eventsRef.current + separator + `Error: ${msg}`);
        persist({ connectionStatus: 'error' });
      }
      cleanup();
    }
  }, [url, headers, cleanup, writeEvents, persist]);

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionStatus('disconnected');
    persist({ connectionStatus: 'disconnected' });
  }, [cleanup, persist]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    url,
    setUrl: setUrlPersist,
    headers,
    addHeader,
    removeHeader,
    updateHeader,
    events,
    connectionStatus,
    stats,
    connect,
    disconnect,
  };
};

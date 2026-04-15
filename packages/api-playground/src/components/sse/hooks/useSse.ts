import { useCallback, useEffect, useRef, useState } from 'react';

import { Header } from '~/components/restApi/types';

import { ConnectionStatus, SseStats } from '../types';

type Params = {
  defaultUrl?: string;
  defaultHeaders?: Record<string, string>;
};

const toHeaderArray = (headers?: Record<string, string>): Header[] => {
  if (!headers) return [{ key: '', value: '' }];
  const entries = Object.entries(headers).map(([key, value]) => ({ key, value }));
  return entries.length > 0 ? entries : [{ key: '', value: '' }];
};

export const useSse = ({ defaultUrl, defaultHeaders }: Params) => {
  const [url, setUrl] = useState(defaultUrl ?? '');
  const [headers, setHeaders] = useState<Header[]>(toHeaderArray(defaultHeaders));
  const [events, setEvents] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<SseStats | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const eventsRef = useRef('');
  const statsRef = useRef<SseStats>({ connectionDuration: 0, eventsReceived: 0, totalBytes: 0 });

  const addHeader = useCallback(() => {
    setHeaders(prev => [...prev, { key: '', value: '' }]);
  }, []);

  const removeHeader = useCallback((index: number) => {
    setHeaders(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateHeader = useCallback((index: number, field: 'key' | 'value', val: string) => {
    setHeaders(prev => prev.map((h, i) => (i === index ? { ...h, [field]: val } : h)));
  }, []);

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

  const connect = useCallback(async () => {
    if (!url.trim()) return;

    cleanup();
    setConnectionStatus('connecting');
    setEvents('');
    eventsRef.current = '';
    statsRef.current = { connectionDuration: 0, eventsReceived: 0, totalBytes: 0 };
    setStats(null);

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
        setEvents(`Error: ${res.status} ${res.statusText}`);
        cleanup();
        return;
      }

      if (!res.body) {
        setConnectionStatus('error');
        setEvents('Error: No response body (streaming not supported)');
        cleanup();
        return;
      }

      setConnectionStatus('connected');

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
            eventsRef.current += separator + data;
            statsRef.current = {
              ...statsRef.current,
              eventsReceived: statsRef.current.eventsReceived + 1,
              totalBytes: statsRef.current.totalBytes + new Blob([data]).size,
            };

            setEvents(eventsRef.current);
            setStats({ ...statsRef.current });
          }
        }
      }

      // Stream ended naturally
      setConnectionStatus('disconnected');
      cleanup();
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('error');
        const msg = e instanceof Error ? e.message : 'Connection failed';
        const separator = eventsRef.current ? '\n---\n' : '';
        eventsRef.current += separator + `Error: ${msg}`;
        setEvents(eventsRef.current);
      }
      cleanup();
    }
  }, [url, headers, cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionStatus('disconnected');
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
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
  };
};

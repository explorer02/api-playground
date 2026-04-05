import { useCallback, useState } from 'react';
import { prettifyJSON } from '~/utils/prettifyJSON';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type Header = { key: string; value: string };

type Stats = {
  duration: number;
  status: number;
  statusText: string;
};

type Params = {
  defaultUrl?: string;
  defaultMethod?: HttpMethod;
  defaultHeaders?: Record<string, string>;
  defaultBody?: string;
};

const toHeaderArray = (headers?: Record<string, string>): Header[] => {
  if (!headers) return [{ key: '', value: '' }];
  const entries = Object.entries(headers).map(([key, value]) => ({ key, value }));
  return entries.length > 0 ? entries : [{ key: '', value: '' }];
};

export const useRestApi = ({ defaultUrl, defaultMethod, defaultHeaders, defaultBody }: Params) => {
  const [url, setUrl] = useState(defaultUrl ?? '');
  const [method, setMethod] = useState<HttpMethod>(defaultMethod ?? 'GET');
  const [headers, setHeaders] = useState<Header[]>(toHeaderArray(defaultHeaders));
  const [body, setBody] = useState(defaultBody ?? '');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  const addHeader = useCallback(() => {
    setHeaders(prev => [...prev, { key: '', value: '' }]);
  }, []);

  const removeHeader = useCallback((index: number) => {
    setHeaders(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateHeader = useCallback((index: number, field: 'key' | 'value', val: string) => {
    setHeaders(prev => prev.map((h, i) => (i === index ? { ...h, [field]: val } : h)));
  }, []);

  const execute = useCallback(async () => {
    setLoading(true);
    setResponse('');
    setStats(null);

    const headerObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key.trim()) {
        headerObj[h.key.trim()] = h.value;
      }
    });

    const fetchOptions: RequestInit = {
      method,
      headers: headerObj,
    };

    if (method !== 'GET' && body.trim()) {
      fetchOptions.body = body;
    }

    const start = performance.now();

    try {
      const res = await fetch(url, fetchOptions);
      const duration = performance.now() - start;

      setStats({
        duration: Math.round(duration),
        status: res.status,
        statusText: res.statusText,
      });

      let responseText: string;
      try {
        const json = await res.json();
        responseText = prettifyJSON(json);
      } catch {
        responseText = await res.text();
      }

      setResponse(responseText);
    } catch (e: unknown) {
      const duration = performance.now() - start;
      setStats({
        duration: Math.round(duration),
        status: 0,
        statusText: 'Network Error',
      });
      setResponse(e instanceof Error ? e.message : 'An error occurred');
    }

    setLoading(false);
  }, [url, method, headers, body]);

  return {
    url,
    setUrl,
    method,
    setMethod,
    headers,
    addHeader,
    removeHeader,
    updateHeader,
    body,
    setBody,
    response,
    loading,
    stats,
    execute,
  };
};

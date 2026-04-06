export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type Header = { key: string; value: string };

export type RestApiStats = {
  duration: number;
  status: number;
  statusText: string;
};

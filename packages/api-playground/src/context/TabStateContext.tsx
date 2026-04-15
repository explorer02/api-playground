import { createContext, ReactNode, useCallback, useContext, useRef } from 'react';

import { ExecutionStatsData } from '~/components/executionStats/types';
import { Header, RestApiStats } from '~/components/restApi/types';
import { ConnectionStatus } from '~/types';

export type QueryExecutorTabState = {
  type: 'QUERY_EXECUTOR';
  input: string;
  variables: string;
  output: string;
  stats: ExecutionStatsData | null;
};

export type MutationExecutorTabState = {
  type: 'MUTATION_EXECUTOR';
  input: string;
  variables: string;
  output: string;
  stats: ExecutionStatsData | null;
};

export type RestApiTabState = {
  type: 'REST_API';
  url: string;
  method: string;
  headers: Header[];
  body: string;
  response: string;
  stats: RestApiStats | null;
};

export type SseTabState = {
  type: 'SSE';
  url: string;
  headers: Header[];
  events: string;
  connectionStatus: ConnectionStatus;
};

export type RestWebsocketTabState = {
  type: 'REST_WEBSOCKET';
  url: string;
  messageDraft: string;
  messages: { id: string; direction: 'sent' | 'received'; data: string; timestamp: number }[];
  connectionStatus: ConnectionStatus;
};

export type GqlSubscriptionTabState = {
  type: 'GQL_SUBSCRIPTION';
  wsUrl: string;
  query: string;
  variables: string;
  events: string;
  connectionStatus: ConnectionStatus;
};

export type TabState =
  | QueryExecutorTabState
  | MutationExecutorTabState
  | RestApiTabState
  | SseTabState
  | RestWebsocketTabState
  | GqlSubscriptionTabState;

type TabStateContextType = {
  getState: <T extends TabState>(tabId: string) => T | undefined;
  setState: <T extends TabState>(tabId: string, state: T) => void;
  removeState: (tabId: string) => void;
};

const TabStateContext = createContext<TabStateContextType>({
  getState: () => undefined,
  setState: () => {},
  removeState: () => {},
});

export const TabStateProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<Map<string, TabState>>(new Map());

  const getState = useCallback(<T extends TabState>(tabId: string): T | undefined => {
    return storeRef.current.get(tabId) as T | undefined;
  }, []);

  const setState = useCallback(<T extends TabState>(tabId: string, state: T) => {
    storeRef.current.set(tabId, state);
  }, []);

  const removeState = useCallback((tabId: string) => {
    storeRef.current.delete(tabId);
  }, []);

  return <TabStateContext.Provider value={{ getState, setState, removeState }}>{children}</TabStateContext.Provider>;
};

export const useTabState = () => useContext(TabStateContext);

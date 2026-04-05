import { createContext, ReactNode, useCallback, useContext, useRef } from 'react';

import { ExecutionStatsData } from '~/components/executionStats/types';

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
  headers: { key: string; value: string }[];
  body: string;
  response: string;
  stats: { duration: number; status: number; statusText: string } | null;
};

export type TabState = QueryExecutorTabState | MutationExecutorTabState | RestApiTabState;

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

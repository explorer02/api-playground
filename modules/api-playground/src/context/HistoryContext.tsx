import { createContext, ReactNode, useContext } from 'react';
import { useQueryHistory } from '@/hooks/useQueryHistory';
import { HistoryEntry } from '@/components/queryHistory/types';

type HistoryContextType = {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextType>({
  entries: [],
  addEntry: () => {},
  clearHistory: () => {},
});

export const HistoryProvider = ({ instanceId, children }: { instanceId: string; children: ReactNode }) => {
  const history = useQueryHistory(instanceId);
  return <HistoryContext.Provider value={history}>{children}</HistoryContext.Provider>;
};

export const useHistory = () => useContext(HistoryContext);

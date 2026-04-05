import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import { useQueryHistory } from '~/hooks/useQueryHistory';
import { HistoryEntry } from '~/components/queryHistory/types';

type HistoryContextType = {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  clearHistoryForType: (templateType: string) => void;
};

const HistoryContext = createContext<HistoryContextType>({
  entries: [],
  addEntry: () => {},
  clearHistory: () => {},
  clearHistoryForType: () => {},
});

export const HistoryProvider = ({ instanceId, children }: { instanceId: string; children: ReactNode }) => {
  const history = useQueryHistory(instanceId);
  return <HistoryContext.Provider value={history}>{children}</HistoryContext.Provider>;
};

export const useHistory = (templateType?: string) => {
  const ctx = useContext(HistoryContext);

  const filteredEntries = useMemo(
    () => (templateType ? ctx.entries.filter(e => e.templateType === templateType) : ctx.entries),
    [ctx.entries, templateType]
  );

  const clearHistory = useCallback(() => {
    if (templateType) {
      ctx.clearHistoryForType(templateType);
    } else {
      ctx.clearHistory();
    }
  }, [templateType, ctx]);

  return { entries: filteredEntries, addEntry: ctx.addEntry, clearHistory };
};

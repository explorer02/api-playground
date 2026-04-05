import { useCallback, useState } from 'react';
import { HistoryEntry } from '~/components/queryHistory/types';

const MAX_ENTRIES = 50;

const getStorageKey = (instanceId: string) => `api-playground:${instanceId}:history`;

const readEntries = (instanceId: string): HistoryEntry[] => {
  try {
    const raw = localStorage.getItem(getStorageKey(instanceId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeEntries = (instanceId: string, entries: HistoryEntry[]) => {
  try {
    localStorage.setItem(getStorageKey(instanceId), JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable
  }
};

type ReturnType = {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  clearHistoryForType: (templateType: string) => void;
};

export const useQueryHistory = (instanceId: string): ReturnType => {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => readEntries(instanceId));

  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
      };
      setEntries(prev => {
        const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
        writeEntries(instanceId, updated);
        return updated;
      });
    },
    [instanceId]
  );

  const clearHistory = useCallback(() => {
    setEntries([]);
    writeEntries(instanceId, []);
  }, [instanceId]);

  const clearHistoryForType = useCallback(
    (templateType: string) => {
      setEntries(prev => {
        const updated = prev.filter(e => e.templateType !== templateType);
        writeEntries(instanceId, updated);
        return updated;
      });
    },
    [instanceId]
  );

  return { entries, addEntry, clearHistory, clearHistoryForType };
};

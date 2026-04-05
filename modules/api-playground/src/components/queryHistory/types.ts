export type HistoryEntry = {
  id: string;
  queryText: string;
  variables: string;
  result: string;
  timestamp: number;
  responseTimeMs: number;
  templateId: string;
};

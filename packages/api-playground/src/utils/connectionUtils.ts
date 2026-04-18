import { ConnectionStatus } from '~/types';

export const STATUS_COLORS: Record<ConnectionStatus, string> = {
  disconnected: '#888',
  connecting: '#f59e0b',
  connected: '#22c55e',
  error: '#ef4444',
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

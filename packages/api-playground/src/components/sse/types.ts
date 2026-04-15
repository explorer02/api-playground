export type { ConnectionStatus } from '~/types';

export type SseStats = {
  connectionDuration: number;
  eventsReceived: number;
  totalBytes: number;
};

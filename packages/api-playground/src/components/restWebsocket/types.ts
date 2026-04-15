export type { ConnectionStatus } from '~/types';

export type WsMessage = {
  id: string;
  direction: 'sent' | 'received';
  data: string;
  timestamp: number;
};

export type WsStats = {
  connectionDuration: number;
  messagesSent: number;
  messagesReceived: number;
};

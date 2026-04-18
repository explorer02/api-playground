/**
 * Lightweight graphql-ws protocol (graphql-transport-ws) client.
 * Implements the minimal subset needed for subscriptions.
 *
 * Protocol spec: https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md
 */

type MessageHandler = {
  onData: (data: unknown) => void;
  onError: (error: unknown) => void;
  onComplete: () => void;
  onConnected: () => void;
};

export const createGraphqlWsClient = (
  wsUrl: string,
  query: string,
  variables: Record<string, unknown> | undefined,
  handlers: MessageHandler
): { close: () => void } => {
  const ws = new WebSocket(wsUrl, 'graphql-transport-ws');
  const subscriptionId = '1';

  let ackReceived = false;

  const sendSubscribe = () => {
    ws.send(
      JSON.stringify({
        id: subscriptionId,
        type: 'subscribe',
        payload: {
          query,
          variables: variables ?? {},
        },
      })
    );
  };

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'connection_init' }));
  };

  ws.onmessage = event => {
    try {
      const msg = JSON.parse(event.data as string);

      switch (msg.type) {
        case 'connection_ack':
          ackReceived = true;
          handlers.onConnected();
          sendSubscribe();
          break;

        case 'next':
          if (msg.id === subscriptionId && msg.payload) {
            handlers.onData(msg.payload);
          }
          break;

        case 'error':
          if (msg.id === subscriptionId && msg.payload) {
            handlers.onError(msg.payload);
          }
          break;

        case 'complete':
          if (msg.id === subscriptionId) {
            handlers.onComplete();
          }
          break;

        case 'ping':
          // Respond to server ping, then check if we missed ack
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        case 'pong':
          // Server responded to our ping — no action needed
          break;

        case 'ka':
          // Legacy subscriptions-transport-ws keepalive — treat as ack if not yet received
          if (!ackReceived) {
            ackReceived = true;
            handlers.onConnected();
            sendSubscribe();
          }
          break;
      }
    } catch {
      // Ignore malformed messages
    }
  };

  ws.onerror = () => {
    handlers.onError('WebSocket connection error');
  };

  ws.onclose = () => {
    handlers.onComplete();
  };

  return {
    close: () => {
      if (ws.readyState === WebSocket.OPEN) {
        // Send complete to unsubscribe gracefully
        ws.send(JSON.stringify({ id: subscriptionId, type: 'complete' }));
        ws.close();
      } else if (ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    },
  };
};

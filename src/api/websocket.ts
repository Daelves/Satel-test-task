import { CallRecord } from '../pages/ActiveCallsPage/model/callsTable.ts';

interface WebSocketConnection {
  socket: WebSocket;
  onCallsList: (callsList: CallRecord[]) => void;
  onCallUpdate: (callUpdate: CallRecord) => void;
  disconnect: () => void;
}

export const createWebSocketConnection = (): WebSocketConnection => {
  const wsUrl =
    import.meta.env?.WS_API_URL ||
    window.ENV?.WS_API_URL ||
    'wss://api.example.com/ws/active-calls';
  const socket = new WebSocket(wsUrl);

  const connection: WebSocketConnection = {
    socket,
    onCallsList: () => {},
    onCallUpdate: () => {},
    disconnect: () => {
      socket.close();
    },
  };

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established');

    socket.send(
      JSON.stringify({
        type: 'subscribe',
        target: 'active-calls',
      })
    );
  });

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'calls-list':
          connection.onCallsList(data.calls);
          break;
        case 'call-update':
          connection.onCallUpdate(data.call);
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });

  socket.addEventListener('close', (event) => {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);

    if (event.code !== 1000) {
      console.log('Attempting to reconnect...');
    }
  });

  return connection;
};

export const sendWebSocketCommand = (
  socket: WebSocket,
  command: string,
  payload: any = {}
) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: command,
        ...payload,
      })
    );
  } else {
    console.error('WebSocket is not open. Current state:', socket.readyState);
  }
};

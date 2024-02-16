import { IncomingMessage } from 'http';
import WebSocket from 'ws';

export type WebSocketMessage = WebSocket.RawData;
export type WSServerType = WebSocket.Server<
  typeof WebSocket,
  typeof IncomingMessage
>;
export type WebsocketCustom = WebSocket & { userId: number };

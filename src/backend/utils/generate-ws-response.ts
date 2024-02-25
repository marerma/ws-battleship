import { MESSAGE_TYPE } from '../const/message-type';
import WebSocket from 'ws';
import { WSServerType } from '../types';

export const generateResponse = <T>(type: MESSAGE_TYPE, data: T) => {
  return {
    type,
    data: JSON.stringify(data),
    id: 0,
  };
};

export const sendResponse = <T>(ws: WebSocket, data: T) => {
  ws.send(JSON.stringify(data));
};

export const sendResponseToAll = <T>(
  webSocketServer: WSServerType,
  data: T
) => {
  webSocketServer.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};

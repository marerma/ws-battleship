import WebSocket from 'ws';
import { parseWsData } from './utils/parse-message';
import { MESSAGE_TYPE } from './const/message-type';
import { registerUser } from './ws-handlers/register/register';
import { generateUniqueId } from './utils/generate-id';
import { USERS_DATA } from './db/user-list';

export const initWsServer = (port: number) => {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', function connection(ws) {
    const connectionId = generateUniqueId();
    console.log(
      `🆕 Client with ID ${connectionId} connected to websocket server`
    );

    ws.on('error', console.error);

    ws.on('message', async function message(data) {
      const message = parseWsData(data);
      const { type } = JSON.parse(message);
      switch (type) {
        case MESSAGE_TYPE.REG: {
          const response = await registerUser(message, connectionId);
          console.log(response, USERS_DATA.users)
        }
      }
    });
  });
  wss.on('listening', () => {
    console.log(`WS server is running on port ${port}`);
  });
};

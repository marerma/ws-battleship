import WebSocket from 'ws';
import { parseWsData } from './utils/parse-message';
import { MESSAGE_TYPE } from './const/message-type';
import { registerUser } from './ws-handlers/register/register';
import { generateUniqueId } from './utils/generate-id';
import {
  addUserToRoom,
  createRoom,
  updateRooms,
} from './ws-handlers/room-hanlders/room-handler';
import { updateWinners } from './ws-handlers/winner-handler/winner-handler';
import { WebsocketCustom } from './types';
import {
  addShips,
  handleAttack,
} from './ws-handlers/game-handlers/game-handler';

export const initWsServer = (port: number) => {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', function connection(ws: WebsocketCustom) {
    const userId = generateUniqueId();
    ws.userId = userId;
    console.log(`🆕 Client with ID ${userId} connected to websocket server`);

    ws.on('error', console.error);

    ws.on('message', async function message(data) {
      const message = parseWsData(data);
      const { type } = JSON.parse(message);
      switch (type) {
        case MESSAGE_TYPE.REG: {
          await registerUser(ws, message, userId);
          await updateRooms(wss);
          await updateWinners(wss, userId);
          break;
        }
        case MESSAGE_TYPE.CREATE_ROOM: {
          await createRoom(userId);
          await updateRooms(wss);
          break;
        }
        case MESSAGE_TYPE.ADD_TO_ROOM: {
          await addUserToRoom(wss, message, userId);
          await updateRooms(wss);
          break;
        }
        case MESSAGE_TYPE.ADD_SHIPS: {
          await addShips(wss, message);
          break;
        }
        case MESSAGE_TYPE.ATTACK: {
          await handleAttack(wss, message);
          break;
        }
      }
    });
    ws.on('close', async () => {
      console.log('Goodbuy, you are disconnected from websocket');
    });
  });
  wss.on('listening', () => {
    console.log(`WS server is running on port ${port}`);
  });
};

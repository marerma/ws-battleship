import { MESSAGE_TYPE } from '../../const/message-type';
import {
  addDBUserToRoom,
  createDBRoom,
  getUserById,
  updateDBRooms,
} from '../../db/data-handler';
import { WSServerType } from '../../types';
import {
  generateResponse,
  sendResponseToAll,
} from '../../utils/generate-ws-response';
import { createGame } from '../game-handlers/game-handler';

export const createRoom = async (index: number) => {
  const user = await getUserById(index);
  if (user) {
    await createDBRoom(user, index);
  }
};

export const updateRooms = async (wss: WSServerType) => {
  const rooms = await updateDBRooms();
  const responseBody = generateResponse(MESSAGE_TYPE.UPDATE_ROOM, rooms);
  sendResponseToAll(wss, responseBody);
};

export const addUserToRoom = async (
  wss: WSServerType,
  message: string,
  connectionId: number
) => {
  const { data } = JSON.parse(message);
  const { indexRoom } = JSON.parse(data);
  const room = await addDBUserToRoom(indexRoom, connectionId);
  await createGame(wss, room.roomUsers);
};

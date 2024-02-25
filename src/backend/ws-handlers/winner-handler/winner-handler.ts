import { MESSAGE_TYPE } from '../../const/message-type';
import { updateDBWinners } from '../../db/data-handler';
import { WSServerType } from '../../types';
import {
  generateResponse,
  sendResponseToAll,
} from '../../utils/generate-ws-response';

export const updateWinners = async (wss: WSServerType, index: number) => {
  const winners = await updateDBWinners(index);
  const responseBody = generateResponse(MESSAGE_TYPE.UPDATE_WIN, winners);
  sendResponseToAll(wss, responseBody);
};

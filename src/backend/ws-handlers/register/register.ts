import { MESSAGE_TYPE } from '../../const/message-type';
import { addNewUser } from '../../db/data-handler';
import {
  generateResponse,
  sendResponse,
} from '../../utils/generate-ws-response';
import WebSocket from 'ws';

export const registerUser = async (
  ws: WebSocket,
  message: string,
  index: number
) => {
  const { data } = JSON.parse(message);
  const newUser = { ...JSON.parse(data), index };

  try {
    const resData = await addNewUser(newUser);
    const dataToSend = {
      name: resData.name,
      index: resData.index,
      error: false,
      errorText: '',
    };
    const responseBody = generateResponse(MESSAGE_TYPE.REG, dataToSend);
    sendResponse(ws, responseBody);
  } catch (err) {
    const dataToSend = {
      name: data.name,
      index: data.index,
      error: true,
      errorText: err.message,
    };
    const responseBody = generateResponse(MESSAGE_TYPE.REG, dataToSend);
    sendResponse(ws, responseBody);
  }
};

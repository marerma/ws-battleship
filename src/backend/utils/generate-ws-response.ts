import { MESSAGE_TYPE } from '../const/message-type';

export const generateResponse = (type: MESSAGE_TYPE, data: string) => {
  return JSON.stringify({
    type,
    data,
    id: 0,
  });
};

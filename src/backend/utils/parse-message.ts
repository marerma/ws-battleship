import { CustomError } from '../errors/custom-error';
import { ERROR_MES } from '../errors/error-messages';
import { WebSocketMessage } from '../types';

export const parseWsData = (message: WebSocketMessage) => {
  const transformedData = message.toString('utf-8');
  return transformedData;
};

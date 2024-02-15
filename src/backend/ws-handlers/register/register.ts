import { MESSAGE_TYPE } from '../../const/message-type';
import { addNewUser } from '../../db/data-handler';
import { generateResponse } from '../../utils/generate-ws-response';

export const registerUser = async (message: string, index: number) => {
  const { data } = JSON.parse(message);
  const newUser = { ...JSON.parse(data), index };

  try {
    const resData = await addNewUser(newUser);
    const dataToSend = JSON.stringify({
      name: resData.name,
      index: resData.index,
      error: false,
      errorText: '',
    });

    return generateResponse(MESSAGE_TYPE.REG, JSON.stringify(dataToSend));
  } catch (err) {
    const dataToSend = JSON.stringify({
      name: data.name,
      index: data.index,
      error: true,
      errorText: err.message,
    });
    return generateResponse(MESSAGE_TYPE.REG, JSON.stringify(dataToSend));
  }
};

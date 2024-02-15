import { MESSAGE_TYPE } from '../../const/message-type';

type RegResponse = {
  type: MESSAGE_TYPE.REG;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: string;
};

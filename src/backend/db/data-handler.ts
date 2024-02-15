import { USERS_DATA } from './user-list';

export const addNewUser = async (user: User) => {
  const { name } = user;
  const userExist = USERS_DATA.users.find((u) => u.name === name) || null;

  if (!userExist) {
    USERS_DATA.users.push(user);
  }
  return user;
};

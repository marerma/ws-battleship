import { GAME_STATUS } from '../const/status';
import { generateUniqueId } from '../utils/generate-id';
import { initPlayerField } from './attack-checker';
import { APP_DATA } from './db';
import { Game, Ship, User } from './types';

export const getUserById = async (id: number) => {
  const user = APP_DATA.users.find((u) => u.index === id);
  return user;
};

export const addNewUser = async (user: User) => {
  const { name } = user;
  const userExist = APP_DATA.users.find((u) => u.name === name) || null;

  if (!userExist) {
    APP_DATA.users.push(user);
  }
  return user;
};

export const createDBRoom = async (user: User, index: number) => {
  APP_DATA.rooms.push({
    roomId: index,
    roomUsers: [user],
  });
};

export const updateDBRooms = async () => {
  APP_DATA.rooms = await getAvailableRooms();
  return APP_DATA.rooms;
};

export const getAvailableRooms = async () => {
  return APP_DATA.rooms.filter((room) => room.roomUsers.length < 2);
};

export const updateDBWinners = async (playerId: number) => {
  const user = APP_DATA.users.find((user) => user.index === playerId);
  if (!user) return;

  const winnerExistIndex = APP_DATA.winners.findIndex(
    (u) => u.name === user.name
  );

  if (winnerExistIndex !== -1) {
    APP_DATA.winners[winnerExistIndex].wins++;
  } else {
    APP_DATA.winners.push({ name: user.name, wins: 0 });
  }
  return APP_DATA.winners;
};

export const addDBUserToRoom = async (roomIndex: number, userId: number) => {
  const roomToEnter = APP_DATA.rooms.find(({ roomId }) => roomId === roomIndex);
  if (roomToEnter && roomToEnter.roomUsers.length < 2) {
    const userToAdd = await getUserById(userId);
    roomToEnter.roomUsers.push(userToAdd);
  }
  return roomToEnter;
};

export const createDBGame = async (players: User[]) => {
  const [user1, user2] = players;
  const player1 = { index: user1.index, ships: [], playerField: [] };
  const player2 = { index: user2.index, ships: [], playerField: [] };

  const gameId = generateUniqueId();
  APP_DATA.games.push({
    gameId,
    players: [player1, player2],
    currentPlayer: player1.index,
    status: GAME_STATUS.start,
  });
  return gameId;
};

export const getCurrentGame = async (gameId: number): Promise<Game> => {
  return APP_DATA.games.find((game: Game) => game.gameId === gameId);
};
export const addDBShip = async (
  gameId: number,
  playerId: number,
  ships: Ship[]
) => {
  const currentGame = await getCurrentGame(gameId);
  if (currentGame) {
    const player = currentGame.players.find((u) => u.index === playerId);
    if (player) {
      player.ships = ships;
      player.playerField = initPlayerField(ships);
    }
  }
  const bothHaveShips = currentGame.players.every((p) => p.ships.length > 0);
  if (bothHaveShips) currentGame.status = GAME_STATUS.ready;
  return currentGame;
};

export const getCurrentGamePlayer = async (gameId: number) => {
  const currentGame = await getCurrentGame(gameId);
  return currentGame.players.find((p) => p.index === currentGame.currentPlayer);
};

export const getAttackedPlayer = async (gameId: number) => {
  const currentGame = await getCurrentGame(gameId);
  return currentGame.players.find((p) => p.index !== currentGame.currentPlayer);
};

export const updateTurn = async (gameId: number, playerId: number) => {
  const currentGame = await getCurrentGame(gameId);
  currentGame.currentPlayer = playerId;
};
// export const updatePlayerField = async (params:type) => {

// }

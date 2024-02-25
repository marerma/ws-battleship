import { checkAttackCoords } from './../../db/attack-checker';
import { MESSAGE_TYPE } from '../../const/message-type';
import { GAME_STATUS, SHIP_STATUS } from '../../const/status';
import {
  addDBShip,
  createDBGame,
  getAttackedPlayer,
  getCurrentGame,
  getCurrentGamePlayer,
  updateTurn,
} from '../../db/data-handler';
import { User } from '../../db/types';
import { WSServerType, WebsocketCustom } from '../../types';
import { generateResponse } from '../../utils/generate-ws-response';

export const createGame = async (wss: WSServerType, players: User[]) => {
  const gameId = await createDBGame(players);

  wss.clients.forEach((client: WebsocketCustom) => {
    players.forEach((player) => {
      if (client.userId === player.index) {
        const resBody = generateResponse(MESSAGE_TYPE.CREATE_GAME, {
          idGame: gameId,
          idPlayer: player.index,
        });
        client.send(JSON.stringify(resBody));
      }
    });
  });
};

export const addShips = async (wss: WSServerType, message: string) => {
  const { data } = JSON.parse(message);
  const { gameId, indexPlayer, ships } = JSON.parse(data);
  const { status, currentPlayer, players } = await addDBShip(
    gameId,
    indexPlayer,
    ships
  );

  if (status === GAME_STATUS.ready) {
    const { ships } = await getCurrentGamePlayer(gameId);
    const startGameResponse = generateResponse(MESSAGE_TYPE.START_GAME, {
      ships,
      currentPlayerIndex: currentPlayer,
    });
    const turnInfoResponse = await getTurnInfoResponse(gameId);
    wss.clients.forEach((client: WebsocketCustom) => {
      players.forEach((player) => {
        if (client.userId === player.index) {
          client.send(JSON.stringify(startGameResponse));
          client.send(JSON.stringify(turnInfoResponse));
        }
      });
    });
  }
};

export const getTurnInfoResponse = async (gameId: number) => {
  const { currentPlayer } = await getCurrentGame(gameId);
  const responseBody = generateResponse(MESSAGE_TYPE.TURN, {
    currentPlayer,
  });
  return responseBody;
};

export const handleAttack = async (wss: WSServerType, message: string) => {
  const { data } = JSON.parse(message);
  const { gameId, indexPlayer, x, y } = JSON.parse(data);
  const attackedPlayer = await getAttackedPlayer(gameId);
  const { players } = await getCurrentGame(gameId);
  const { status, position } = await checkAttackCoords(
    { x, y },
    attackedPlayer.playerField
  );
  const responseData = {
    position,
    currentPlayer: indexPlayer,
    status,
  };
  if (status === SHIP_STATUS.miss) {
    await updateTurn(gameId, attackedPlayer.index);
  }
  const responseBody = generateResponse(MESSAGE_TYPE.ATTACK, responseData);
  const turnInfoResponse = await getTurnInfoResponse(gameId);

  wss.clients.forEach((client: WebsocketCustom) => {
    players.forEach((player) => {
      if (client.userId === player.index) {
        client.send(JSON.stringify(responseBody));
        client.send(JSON.stringify(turnInfoResponse));
      }
    });
  });
};

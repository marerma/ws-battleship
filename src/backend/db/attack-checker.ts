import { SHIP_STATUS } from '../const/status';
import { Coordinates, PlayerField, Ship } from './types';

export const initPlayerField = (playerShips: Ship[]) => {
  const field = Array.from({ length: 10 }, () => Array(10).fill(null));

  playerShips.forEach((ship) => {
    const x = ship.position.x;
    const y = ship.position.y;

    if (ship.direction) {
      for (let i = 0; i < ship.length; i++) {
        field[y + i][x] = { status: SHIP_STATUS.ship, ship };
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        field[y][x + i] = { status: SHIP_STATUS.ship, ship };
      }
    }
  });
  return field;
};

export const checkAttackCoords = async (
  incomeCoords: Coordinates,
  playerField: PlayerField
) => {
  const { x, y } = incomeCoords;
  let status = SHIP_STATUS.miss;
  const fieldUnderChecking = playerField[y][x];

  if (fieldUnderChecking) {
    if (fieldUnderChecking.status === SHIP_STATUS.ship) {
      fieldUnderChecking.status = SHIP_STATUS.shot;
      status = SHIP_STATUS.shot;
    }

    const isKilled = await checkKilled(fieldUnderChecking.ship, playerField);
    if (isKilled) {
      // await updateKilledField(
      //   incomeCoords,
      //   fieldUnderChecking.ship,
      //   playerField
      // );
      status = SHIP_STATUS.kill;
    }
  }
  return { status, position: { x, y } };
};

export const checkKilled = async (ship: Ship, playerField: PlayerField) => {
  let isKilled = true;

  if (ship.direction) {
    for (let i = 0; i < ship.length; i++) {
      const checkCell = playerField[ship.position.y + i][ship.position.x];
      if (!checkCell) return false;
      if (checkCell.status === SHIP_STATUS.ship) {
        isKilled = false;
      }
    }
  } else {
    for (let i = 0; i < ship.length; i++) {
      const checkCell = playerField[ship.position.y][ship.position.x + i];
      if (!checkCell) return false;
      if (checkCell.status === SHIP_STATUS.ship) {
        isKilled = false;
      }
    }
  }
  return isKilled;
};

export const updateKilledField = async (
  coords: Coordinates,
  ship: Ship,
  playerField: PlayerField
) => {
  const { x, y } = coords;
  if (ship.direction) {
    for (let i = 0; i < ship.length; i++) {
      playerField[y + i][x] = {
        ship,
        status: SHIP_STATUS.kill,
      };
    }
  } else {
    for (let i = 0; i < ship.length; i++) {
      playerField[y][x + i] = {
        ship,
        status: SHIP_STATUS.kill,
      };
    }
  }
};

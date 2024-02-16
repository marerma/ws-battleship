import { GAME_STATUS, SHIP_STATUS } from '../const/status';

type User = {
  name: string;
  index: number;
};

type UserList = {
  users: User[];
};

type Room = {
  roomId: number;
  roomUsers: User[];
};

type Winner = {
  name: string;
  wins: number;
};

type Coordinates = {
  x: number;
  y: number;
};

type Ship = {
  position: Coordinates;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

type FieldShip = {
  status: SHIP_STATUS;
  ship: Ship;
};

type PlayerField = Array<FieldShip[]>;

type Player = {
  index: number;
  ships: Ship[];
  playerField: PlayerField;
};

type Game = {
  gameId: number;
  players: Player[];
  currentPlayer: number;
  status: GAME_STATUS;
};

type AppData = {
  users: User[];
  rooms: Room[];
  winners: Winner[];
  games: Game[];
};

import { Coordinate, Direction } from '../../shared/lib/types';

export enum Tenant {
  Snake = 'snake',
  Food = 'food',
}

export type Snake = {
  body: SnakeSegment[];
  speed: number;
  alive: boolean;
};

export type SnakeSegment = {
  id: number;
  direction: Direction;
  head: boolean;
  tail: boolean;
  prev: Coordinate;
  curr: Coordinate;
};

export type Food = {
  x: number;
  y: number;
  alive: boolean;
};

export type Cell = {
  tenant?: Tenant.Snake | Tenant.Food;
  x: number;
  y: number;
  style?: JSON;
};

export type Grid = Array<Array<Cell>>;

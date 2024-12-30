import { Coordinate, Direction } from '../../shared/lib/types';

export enum Tenant {
  Snake = 'snake',
  Food = 'food',
  Empty = 'empty',
}

export type Snake = {
  body: SnakeSegment[];
  alive: boolean;
};

export type SnakeSegment = {
  id: number;
  direction: Direction;
  tail: boolean;
  prev: Coordinate;
  curr: Coordinate;
};

export type Food = {
  x: number;
  y: number;
};

export type Cell = {
  tenant?: Tenant;
  x: number;
  y: number;
  style?: JSON;
};

export type Grid = Cell[][];

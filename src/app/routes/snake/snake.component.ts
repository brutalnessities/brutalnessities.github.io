import { Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';
import { Food, Grid, Snake, SnakeSegment, Tenant, Cell } from './types';
import { Direction } from '../../shared/lib/types';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.sass',
})
export class SnakeComponent implements OnInit {
  snake: Snake = {
    body: [],
    speed: 1,
    alive: false,
  };

  food: Food = {
    x: 0,
    y: 0,
    alive: false,
  };

  grid$: BehaviorSubject<Grid> = new BehaviorSubject<Grid>([]);

  destroy$: Subject<void> = new Subject<void>();

  _scale = 1;
  scaleOf(num?: number): Array<number> {
    return Array(num ?? this._scale)
      .fill(0)
      .map((_x: any, i) => i);
  }

  px(num: number) {
    `${num}px`;
  }

  X: number = 1;
  Y: number = 1;
  H: number = 1;

  button = {
    show: true,
    text: 'Start',
  };

  selector = '//*[@id="column"][9]//*[@id="cell"][19]';

  /**
   * @description
   *  - watch the grid updates and handles game logic
   */
  ngOnInit() {
    this.resize();
    this.grid.pipe(filter((grid) => grid.length > 0)).subscribe((grid) => {
      console.log('🔥🔥🔥', grid);
    });
  }

  _gridArray: Grid = [];

  newGrid() {
    const grid: Grid = this.scaleOf(this.X).map((x: number) =>
      this.scaleOf(this.Y).map((y: number) => ({ x, y } as unknown as Cell))
    );
    return grid;
  }

  set grid(grid: Grid) {
    this._gridArray = grid;
    this.grid$.next(grid);
  }

  get grid(): Observable<Grid> {
    return this.grid$.asObservable();
  }

  resize() {
    const a = window.innerWidth;
    const b = document.querySelector('.main')?.clientHeight ?? 135;
    const c = Math.sqrt(a ^ (2 + b) ^ 2);
    this.H = c;
    this.X = Math.floor(a / c);
    this.Y = Math.floor(b / c);
    this.grid = this.newGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resize();
    console.log('🔁🔁🔁');
  }

  @HostListener('toggleHeader', ['$event'])
  toggleHeader() {
    this.resize();
    console.log('🤯🤯🤯');
  }

  getRandomNumberInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  onClick() {
    this.button.show = false;
    this.button.text = 'Restart';
    this.startGame();
  }

  startGame() {
    if (!this.snake.alive) {
      this.initSnake();
      this.snake.alive = true;
      this.gameLoop();
    }
  }

  initSnake() {
    this.snake.alive = true;
    this.snake.speed = 100;
    this.snake.body = Array(5)
      .fill(0)
      .map((_, i) => ({
        x: Math.floor(this.getRandomNumberInRange(0, this.X)),
        y: Math.floor(this.getRandomNumberInRange(0, this.Y)),
        head: i === 0,
        direction: Direction.Up,
      }));
    for (const segment of this.snake.body) {
      this._gridArray[segment.x][segment.y].tenant = Tenant.Snake;
    }
  }

  gameLoop() {
    if (!this.snake.alive) return;
    console.log('start game loop');
    const X = Math.floor(this.getRandomNumberInRange(0, this.X));
    const Y = Math.floor(this.getRandomNumberInRange(0, this.Y));
    console.log('🌍', X, Y);
    // this._gridArray[Math.floor(X)][Y].tenant = Tenant.Snake;
    this.grid = this._gridArray;
    this.updatePosition();
    // this.moveSnake();
    // this.checkCollision();
    // this.checkFood();
    // setTimeout(() => this.gameLoop(), this.snake.speed);
  }

  isOutOfBounds(x: number, y: number) {
    return x < 0 || x >= this.X || y < 0 || y >= this.Y;
  }

  outOfBounds(x: number, y: number, direction: Direction) {
    const out = this.isOutOfBounds(x, y);
    if (out) {
      switch (direction) {
        case Direction.Up:
          return { x: x, y: this.Y - 1 };
        case Direction.Down:
          return { x: x, y: 0 };
        case Direction.Left:
          return { x: this.X - 1, y: y };
        case Direction.Right:
          return { x: 0, y: y };
      }
    }
    return { x, y };
  }

  checkCollision(segment: SnakeSegment): boolean {
    if (!segment.head) return false;
    return (
      this.isOutOfBounds(segment.x, segment.y) ||
      this._gridArray[segment.x][segment.y].tenant === Tenant.Snake
    );
  }

  moveSegment(segment: SnakeSegment) {
    const isOutOfBounds = this.isOutOfBounds(segment.x, segment.y);

    switch (segment.direction) {
      case Direction.Up:
        segment.y = isOutOfBounds ? 0 : segment.y - 1;
        break;
      case Direction.Down:
        segment.y = isOutOfBounds ? this.Y - 1 : segment.y + 1;
        break;
      case Direction.Left:
        segment.x = isOutOfBounds ? this.X - 1 : segment.x - 1;
        break;
      case Direction.Right:
        segment.x = isOutOfBounds ? 0 : segment.x + 1;
        break;
    }
  }

  updatePosition() {
    this.snake.body.reduce((prev, curr) => {
      if (prev.head && this.checkCollision(curr)) {
        console.log('💀💀💀');
        this.snake.alive = false;
      }

      this.moveSegment(curr);

      this._gridArray[prev.x][prev.y].tenant = Tenant.Snake;
      return prev;
    });
  }
  // this.snake = {
  //   x: Math.floor(this.getRandomNumberInRange(0, this.X)),
  //   y: Math.floor(this.getRandomNumberInRange(0, this.Y)),
  //   direction: 'up',
  //   speed: 100,
  //   tail: [],
  //   alive: true,
  // };
  // this.food = {
  //   x: Math.floor(this.getRandomNumberInRange(0, this.X)),
  //   y: Math.floor(this.getRandomNumberInRange(0, this.Y)),
  //   alive: true,
  // };

  // checkFood() {
  //   const { x, y } = this.snake;
  //   if (x === this.food.x && y === this.food.y) {
  //     this.snake.speed -= 5;
  //     this.food = {
  //       x: Math.floor(this.getRandomNumberInRange(0, this.X)),
  //       y: Math.floor(this.getRandomNumberInRange(0, this.Y)),
  //       alive: true,
  //     };
  //   } else {
  //     this.snake.tail.pop();
  //   }
  // }
}

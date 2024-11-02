import { Component, Host, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';
import { Food, Grid, Snake, SnakeSegment, Tenant, Cell } from './types';
import { Coordinate, Direction } from '../../shared/lib/types';

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

  first = false;

  /**
   * @description
   *  - watch the grid updates and handles game logic
   */
  ngOnInit() {
    this.resize();
    this.grid.pipe(filter((grid) => grid.length > 0)).subscribe((grid) => {
      // console.log('🔥🔥🔥', grid);
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
      this.grid = this._gridArray;
      this.gameLoop();
    }
  }

  initSnake() {
    this.first = true;
    this.snake.alive = true;
    this.snake.speed = 100;
    this.snake.body = Array(5)
      .fill(0)
      .map((_, i) => ({
        id: i,
        curr: { x: Math.floor(this.X / 2 + i), y: Math.floor(this.Y / 2) },
        prev: { x: Math.floor(this.X / 2 + i), y: Math.floor(this.Y / 2) },
        head: i === 0,
        direction: Direction.Up,
        tail: i === 4,
      }));
    for (const segment of this.snake.body) {
      this._gridArray[segment.curr.x][segment.curr.y].tenant = Tenant.Snake;
      this._gridArray[segment.curr.x][segment.curr.y].style = JSON.parse(
        JSON.stringify({
          background: segment.head ? 'yellow' : segment.tail ? 'blue' : 'green',
        })
      );
    }
    console.log('🐍🐍🐍', this.snake);
  }

  gameLoop() {
    if (!this.snake.alive) return;
    // this.grid = this._gridArray;
    this.updatePosition();
    // this.moveSnake();
    // this.checkCollision();
    // this.checkFood();
    // setTimeout(() => this.gameLoop(), this.snake.speed * 10);
  }

  checkCollision({ x, y }: Coordinate): boolean {
    return this._gridArray[x][y].tenant === Tenant.Snake;
  };
  updatePosition() {
    this.snake.body = this.snake.body.map((segment, i) => {
      const { head, tail } = segment;
      
      // get the next coordinate
      let { x, y } = this.outOfBoundsWarp(segment);
      
      if (this.checkCollision({ x, y })) {
        // this.snake.alive = false;
      };

      if (!head) {
        // follow the head
        x = this.snake.body[i - 1].prev.x;
        y = this.snake.body[i - 1].prev.y;
      }
      
      if (this._gridArray[x][y].tenant === Tenant.Food) {
        //eat food
        console.warn('🍔🍔🍔');
      }

      // set the new position
      this._gridArray[x][y].tenant = tail ? undefined : Tenant.Snake;
      segment.prev = { x: segment.curr.x, y: segment.curr.y };
      segment.curr = { x, y };
      return segment;
    });
  }

  /**
   * @description - check if the coordinate is out of bounds, if so warp it to the other side
   * @returns {Coordinate} - of the new position
   */
  isOutOfBounds(x: number, y: number) {
    return x < 0 || x >= this.X || y < 0 || y >= this.Y;
  }
  outOfBoundsWarp(segment: SnakeSegment) {
    let { x, y } = segment.curr;
    const isOutOfBounds = this.isOutOfBounds(x, y);
    switch (segment.direction) {
      case Direction.Up:
        y = isOutOfBounds ? 0 : y - 1;
        break;
      case Direction.Down:
        y = isOutOfBounds ? this.Y - 1 : y + 1;
        break;
      case Direction.Left:
        x = isOutOfBounds ? this.X - 1 : x - 1;
        break;
      case Direction.Right:
        x = isOutOfBounds ? 0 : x + 1;
        break;
    }
    return { x, y };
  }


  // move everthing into this and change other functions to be private
  SNAKE_BRAIN() {}

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (!this.snake.alive) return;
    const head = this.snake.body[0];
    const direction = Direction[event.key.replace('Arrow', '') as keyof typeof Direction];
    
    if (direction === Direction.Up && head.direction !== Direction.Down) {
      head.direction = Direction.Up;
    } 
    else if ( direction === Direction.Down && head.direction !== Direction.Up ) {
      head.direction = Direction.Down;
    } 
    else if ( direction === Direction.Left && head.direction !== Direction.Right
    ) {
      head.direction = Direction.Left;
    } 
    else if ( direction === Direction.Right && head.direction !== Direction.Left
    ) {
      head.direction = Direction.Right;
    }
    
    console.log('🔑🔑🔑', event.key);
    this.updatePosition();
  }
}

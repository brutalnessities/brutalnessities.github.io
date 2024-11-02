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
  score = 0;

  padding = 50;

  minCellSize = 25;

  snake: Snake = {
    body: [],
    speed: 1,
    alive: false,
  };

  food: Food = {
    x: 0,
    y: 0,
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
    // this.grid.pipe(filter((grid) => grid.length > 0)).subscribe((grid) => {
    //   console.log('🔥🔥🔥', grid);
    // });
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
    const pythagorean = (num: number = 0) => {
      num += this.padding;
      const a = window.innerWidth - num;
      const b = (document.querySelector('.main')?.clientHeight ?? 500) - num;
      const c = Math.sqrt(a ^ (2 + b) ^ 2);
      return { a, b, c };
    };

    let { a, b, c } = pythagorean();
    let i = 0;
    while (c < this.minCellSize) {
      // find a larger hypotenuse
      const tempObj = pythagorean(i++);
      a = tempObj.a;
      b = tempObj.b;
      c = tempObj.c;
    }

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
    switch (this.button.text) {
      case 'Start':
        this.button.text = 'Restart';
        this.startGame();
        break;
      case 'Restart':
        this.snake.alive = false;
        this.resize();
        this.startGame();
        break;
    }
  }

  startGame() {
    if (!this.snake.alive) {
      this.initSnake();
      this.spawnFood();
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
    console.log('🐍🐍🐍', this.snake);
  }

  spawnFood() {
    const x = Math.floor(this.getRandomNumberInRange(0, this.X));
    const y = Math.floor(this.getRandomNumberInRange(0, this.Y));
    if (this._gridArray[x][y].tenant !== Tenant.Snake) {
      this._gridArray[x][y].tenant = Tenant.Food;
      return;
    } else {
      this.spawnFood();
    }
  }

  timeoutId: any;
  gameLoop() {
    if (!this.snake.alive) {
      clearTimeout(this.timeoutId);
      return;
    }
    // this.grid = this._gridArray;
    this.SNAKE_BRAIN();

    this.timeoutId = setTimeout(() => this.gameLoop(), this.snake.speed);
  }

  checkCollision(segment: SnakeSegment): boolean {
    const { x, y } = segment.curr;
    return this._gridArray[x][y].tenant === Tenant.Snake;
  }
  SNAKE_BRAIN() {
    try {
      for (let i = this.snake.body.length - 1; i >= 0; i--) {
        const segment = this.snake.body[i];
        // this.snake.body = this.snake.body.map((segment, i) => {
        const head = segment.id === 0;
        const { tail, prev, curr } = segment;

        if (head && this.checkCollision(segment)) {
          console.error('💀💀💀💀');
          this.snake.alive = false;
        }

        //eat food
        if (head && this._gridArray[curr.x][curr.y].tenant === Tenant.Food) {
          this.score++;
          this.spawnFood();
          this.addSegment();
          console.warn('🍔🍔🍔');
        }

        // clear the prev position
        if (tail) {
          this._gridArray[prev.x][prev.y].tenant = undefined;
        }

        // get the next coordinate
        let { x, y } = this.outOfBoundsWarp(segment);

        // follow the head
        if (!head) {
          x = this.snake.body[i - 1].prev.x;
          y = this.snake.body[i - 1].prev.y;
        }

        // set the new position
        this._gridArray[segment.curr.x][segment.curr.y].tenant = tail ? undefined : Tenant.Snake;
        segment.prev = { x: segment.curr.x, y: segment.curr.y };
        segment.curr = { x, y };
        this.snake.body[i] = segment;
      }
    } catch (error) {
      console.error('🔥🔥🔥', error);
      this.snake.alive = false;
    }
  }

  /**
   * @description - check if the coordinate is out of bounds, if so warp it to the other side
   * @returns {Coordinate} - of the new position
   */
  isOutOfBounds(x: number, y: number) {
    return x < 0 || x >= this.X || y < 0 || y >= this.Y;
  }
  outOfBoundsWarp(segment: SnakeSegment, wasOut: boolean = false): Coordinate {
    try {
      const head = segment.id === 0;
      if (!head) return segment.curr;
      let { x, y } = segment.curr;
      switch (segment.direction) {
        case Direction.Up:
          y = wasOut ? this.Y - 1 : y - 1;
          break;
        case Direction.Down:
          y = wasOut ? 0 : y + 1;
          break;
        case Direction.Left:
          x = wasOut ? this.X - 1 : x - 1;
          break;
        case Direction.Right:
          x = wasOut ? 0 : x + 1;
          break;
      }
      const isOutOfBounds = this.isOutOfBounds(x, y);
      if (isOutOfBounds) {
        return this.outOfBoundsWarp(segment, true);
      }
      return { x, y };
    } catch (error) {
      console.error('🔥🔥🔥', error);
      return { x: this.X / 2, y: this.Y / 2 };
    }
  }

  addSegment() {
    this.snake.body[this.snake.body.length - 1].tail = false;
    const last = this.snake.body[this.snake.body.length - 1];
    const { x, y } = this.outOfBoundsWarp(last);
    this.snake.body.push({
      id: this.snake.body.length,
      curr: { x, y },
      prev: { x, y },
      direction: last.direction,
      tail: true,
    });
    console.log('🐍', this.snake);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (!this.snake.alive) return;
    const head = this.snake.body[0];
    const direction = Direction[event.key.replace('Arrow', '') as keyof typeof Direction];

    if (direction === Direction.Up && head.direction !== Direction.Down) {
      head.direction = Direction.Up;
    } else if (direction === Direction.Down && head.direction !== Direction.Up) {
      head.direction = Direction.Down;
    } else if (direction === Direction.Left && head.direction !== Direction.Right) {
      head.direction = Direction.Left;
    } else if (direction === Direction.Right && head.direction !== Direction.Left) {
      head.direction = Direction.Right;
    }

    console.log('🔑🔑🔑', event.key);
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Food, Grid, Snake, SnakeSegment, Tenant, Cell } from './types';
import { Coordinate, Direction } from '../../shared/lib/types';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.sass',
})
export class SnakeComponent implements OnInit {
  speed = 100;

  score = 0;

  padding = 50;

  minCellSize = 25;

  snake: Snake = {
    body: [],
    speed: 0,
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
      num += this.padding / 2;
      const a = window.innerWidth - num;
      const b = (document.querySelector('app-snake')?.clientHeight ?? 500) - num;
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
        this.score = 0;
        this.startGame();
        break;
    }
    this.button.show = false;
  }

  startGame() {
    if (!this.snake.alive) {
      clearTimeout(this.timeoutId);
      this.resize();
      this.initSnake();
      this.spawnFood();
      this.grid = this._gridArray;
      this.gameLoop();
    }
  }

  timeoutId: any;
  gameLoop() {
    this.timeoutId = setInterval(() => {
      if (!this.snake.alive) {
        clearTimeout(this.timeoutId);
      }
      this.SNAKE_BRAIN();

      // edge case where the grid space tenant is cleared before the food is eaten
      if (this.food.x && this.food.y && !this._gridArray[this.food.x][this.food.y].tenant) {
        this._gridArray[this.food.x][this.food.y].tenant = Tenant.Food;
      }

    }, this.speed);
  }

  initSnake() {
    this.snake.speed = this.speed;
    this.snake.alive = true;
    this.snake.body = Array(3)
      .fill(0)
      .map((_, i) => ({
        id: i,
        curr: { x: Math.floor(this.X / 2), y: Math.floor(this.Y / 2) + i },
        prev: { x: Math.floor(this.X / 2), y: Math.floor(this.Y / 2) + i },
        direction: Direction.Up,
        tail: i === 2,
      }));
  }

  spawnFood() {
    const x = Math.floor(this.getRandomNumberInRange(0, this.X));
    const y = Math.floor(this.getRandomNumberInRange(0, this.Y));
    if (this._gridArray[x][y].tenant !== Tenant.Snake) {
      this._gridArray[x][y].tenant = Tenant.Food;
      this.food = { x, y };
      return;
    } else {
      this.spawnFood();
    }
  }

  checkCollision(segment: SnakeSegment): boolean {
    const { x, y } = segment.curr;
    return this._gridArray[x][y].tenant === Tenant.Snake;
  }

  SNAKE_BRAIN() {
    try {
      for (let i = this.snake.body.length - 1; i >= 0; i--) {
        const segment = this.snake.body[i];
        const head = segment.id === 0;
        const { tail, prev, curr } = segment;

        if (head) {
          if (this.checkCollision(segment)) {
            console.log('💀', this.snake);
            this._gridArray[curr.x][curr.y].tenant = undefined;
            this._gridArray[curr.x][curr.y].style = JSON.parse(JSON.stringify({ 'background-color': 'red' }));
            this.snake.alive = false;
            this.button.show = true;
            return;
          }

          //eat food
          if (this._gridArray[curr.x][curr.y].tenant === Tenant.Food) {
            this.score++;
            this.spawnFood();
            this.addSegment();
          }
        }

        this.moveSegment(segment);
      }
    } catch (error) {
      console.error('🔥', error);
      this.snake.alive = false;
    }
  }

  moveSegment(segment: SnakeSegment) {
    const { id, tail, prev, curr, direction } = segment;

    // clear the current position
    this._gridArray[curr.x][curr.y].tenant = undefined;
    
    // get the next coordinate
    let { x, y } = this.outOfBoundsWarp(segment);

    // follow the head
    if (id > 0) {
      x = this.snake.body[id - 1].prev.x;
      y = this.snake.body[id - 1].prev.y;
    }

    // set the new position
    this._gridArray[curr.x][curr.y].tenant = tail ? undefined : Tenant.Snake;
    segment.prev = { x: curr.x, y: curr.y };
    segment.curr = { x, y };
    this.snake.body[id] = segment;
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
      console.error('Error setting direction:', error);
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
    
    if (!this.checkCollision(head)) {
      this.snake.body[0] = head;
    }
    // this.moveSegment(head);
  }


  log() {
    console.log('🤖', this);
  }
}

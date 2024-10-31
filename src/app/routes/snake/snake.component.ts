import { Component, Host, HostListener } from '@angular/core';

enum Tenant {
  Snake = 'snake',
  Food = 'food',
}

type Direction = 'up' | 'down' | 'left' | 'right';
type Snake = {
  x: number;
  y: number;
  direction: Direction;
  speed: number;
  tail: Array<{ x: number; y: number }>;
  alive: boolean;
};
type Food = {
  x: number;
  y: number;
  alive: boolean;
};
type Cell = {
  tenant?: Tenant.Snake | Tenant.Food;
  x: number;
  y: number;
  style?: JSON;
};
type Grid = Array<Array<Cell>>;

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.sass',
})
export class SnakeComponent {
  snake: Snake = {
    x: 0,
    y: 0,
    direction: 'up',
    speed: 100,
    tail: [],
    alive: false,
  };

  food: Food = {
    x: 0,
    y: 0,
    alive: false,
  };

  _scale = 1;
  scaleOf(num?: number): Array<number> {
    return Array(num ?? this._scale)
      .fill(0)
      .map((_x: any, i) => i);
  }

  px(num: number) {
    `${num}px`;
  }

  X = 1;
  Y = 1;
  H = 1;

  button = {
    show: true,
    text: 'Start',
  };

  selector = '//*[@id="column"][9]//*[@id="cell"][19]';

  constructor() {
    this.resize();
    this.snake = {
      x: Math.floor(this.X / 2),
      y: Math.floor(this.Y / 2),
      direction: 'up',
      speed: 100,
      tail: [],
      alive: false,
    };
    this.food = {
      x: Math.floor(this.getRandomNumberInRange(0, this.X)),
      y: Math.floor(this.getRandomNumberInRange(0, this.Y)),
      alive: false,
    };
    console.log('🐍🐍🐍', this);
  }

  _gridArray: Grid = [];
  gridArray() {
    this._gridArray = this.scaleOf(this.X).map((x: number) =>
      this.scaleOf(this.Y).map(
        (y: number) =>
          ({
            x,
            y,
            tenant: null,
            style: undefined,
          } as unknown as Cell)
      )
    );
    return this._gridArray;
  }

  resize() {
    const a = window.innerWidth;
    const b = document.querySelector('.main')?.clientHeight ?? 135;
    const c = Math.sqrt(a ^ (2 + b) ^ 2);
    this.H = c;
    this.X = Math.floor(a / c);
    this.Y = Math.floor(b / c);
    this.gridArray();
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
    this.snake.alive = true;
    this.startGame();
  }

  startGame() {
    this.snake = {
      x: Math.floor(this.X / 2),
      y: Math.floor(this.Y / 2),
      direction: 'up',
      speed: 100,
      tail: [],
      alive: true,
    };
    this.food = {
      x: Math.floor(this.getRandomNumberInRange(0, this.X)),
      y: Math.floor(this.getRandomNumberInRange(0, this.Y)),
      alive: true,
    };
    this.gameLoop();
  }

  gameLoop() {
    if (!this.snake.alive) return;
    console.log('start game loop');
    // this.moveSnake();
    // this.checkCollision();
    // this.checkFood();
    // setTimeout(() => this.gameLoop(), this.snake.speed);
  }

  // moveSnake() {
  //   const { x, y, tail } = this.snake;
  //   this.snake.tail = [{ x, y }, ...tail];
  //   this.snake.x =
  //     x +
  //     (this.snake.direction === 'left'
  //       ? -1
  //       : this.snake.direction === 'right'
  //       ? 1
  //       : 0);
  //   this.snake.y =
  //     y +
  //     (this.snake.direction === 'up'
  //       ? -1
  //       : this.snake.direction === 'down'
  //       ? 1
  //       : 0);
  //   console.log('🐍🐍🐍', this.snake);
  //   this.gridArray()[x][y].tenant = Tenant.Snake;
  // }

  // checkCollision() {
  //   const { x, y, tail } = this.snake;
  //   if (
  //     x < 0 ||
  //     x >= this.X ||
  //     y < 0 ||
  //     y >= this.Y ||
  //     tail.some((t) => t.x === x && t.y === y)
  //   ) {
  //     this.snake.alive = false;
  //     this.button.show = true;
  //     this.button.text = 'Game Over';
  //   }
  // }

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
